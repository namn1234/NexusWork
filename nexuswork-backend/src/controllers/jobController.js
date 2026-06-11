const { validationResult } = require("express-validator");
const Job = require("../models/Job");
const Company = require("../models/Company");
const User = require("../models/User");

// ─── GET /api/jobs ─────────────────────────────────────────────────────────────
// Query params: q, category, type (tag), remote, sort (recent|salary|company),
//               page, limit
async function getJobs(req, res, next) {
  try {
    const {
      q,
      category,
      type,
      remote,
      sort = "recent",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { active: true };

    // Full-text search
    if (q) {
      filter.$text = { $search: q };
    }

    if (category) filter.category = category;
    if (type) filter.tags = type;
    if (remote === "true") filter.remote = true;

    const sortMap = {
      recent: { createdAt: -1 },
      salary: { salaryMax: -1 },
      company: { companyName: 1 },
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort(sortMap[sort] ?? sortMap.recent)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Job.countDocuments(filter),
    ]);

    if (process.env.NODE_ENV !== "production") {
      try {
        console.log("DEBUG: getJobs filter=", JSON.stringify(filter), "total=", total, "returned=", jobs.length);
      } catch (e) {
        console.log("DEBUG: getJobs (unable to stringify filter)");
      }
    }

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/jobs/featured ────────────────────────────────────────────────────
async function getFeaturedJobs(req, res, next) {
  try {
    const jobs = await Job.find({ active: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/jobs/:id ─────────────────────────────────────────────────────────
async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name short industry website description logoColor")
      .lean();
    if (!job || !job.active) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/jobs  (employer only) ───────────────────────────────────────────
async function createJob(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const {
      title,
      companyId,
      salary,
      salaryMin,
      salaryMax,
      location,
      remote,
      tags,
      category,
      description,
      featured,
    } = req.body;

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const job = await Job.create({
      title,
      company: company._id,
      companyName: company.name,
      companyShort: company.short,
      logoColor: company.logoColor,
      salary,
      salaryMin,
      salaryMax,
      location,
      remote: !!remote,
      tags,
      category,
      description,
      featured: !!featured,
      postedBy: req.user._id,
    });

    if (process.env.NODE_ENV !== "production") {
      try {
        console.log("DEBUG: Job created", job._id ? job._id.toString() : job);
      } catch (e) {
        console.log("DEBUG: Job created (unable to stringify id)");
      }
    }

    // Keep company job count in sync
    await Company.findByIdAndUpdate(company._id, { $inc: { jobCount: 1 } });

    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/jobs/:id  (employer — own jobs only) ──────────────────────────
async function updateJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your job posting" });
    }

    const allowed = [
      "title", "salary", "salaryMin", "salaryMax",
      "location", "remote", "tags", "category",
      "description", "featured", "active",
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/jobs/:id  (employer — own jobs only) ─────────────────────────
async function deleteJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your job posting" });
    }

    job.active = false; // soft delete
    await job.save();
    await Company.findByIdAndUpdate(job.company, { $inc: { jobCount: -1 } });

    res.json({ message: "Job removed" });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/jobs/:id/save  (jobseeker) ─────────────────────────────────────
async function toggleSaveJob(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;
    const idx = user.savedJobs.indexOf(jobId);

    let saved;
    if (idx === -1) {
      user.savedJobs.push(jobId);
      saved = true;
    } else {
      user.savedJobs.splice(idx, 1);
      saved = false;
    }
    await user.save();
    res.json({ saved, savedJobs: user.savedJobs });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/jobs/saved  (jobseeker) ─────────────────────────────────────────
async function getSavedJobs(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");
    res.json({ jobs: user.savedJobs });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getJobs,
  getFeaturedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs,
};
