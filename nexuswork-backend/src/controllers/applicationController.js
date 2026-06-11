const { validationResult } = require("express-validator");
const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications  — submit an application (jobseeker)
async function apply(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { jobId, name, email, portfolioUrl, coverLetter, availability } = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.active) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existing) {
      return res.status(409).json({ message: "You already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      jobTitle: job.title,
      companyName: job.companyName,
      name,
      email,
      portfolioUrl,
      coverLetter,
      availability,
    });

    // Increment counter
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/mine  — list my applications (jobseeker)
async function myApplications(req, res, next) {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ applications: apps });
  } catch (err) {
    next(err);
  }
}

// GET /api/applications/job/:jobId  — applications for a job posting (employer)
async function jobApplications(req, res, next) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your job posting" });
    }

    const apps = await Application.find({ job: req.params.jobId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ applications: apps });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/applications/:id/status  — update status (employer)
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "shortlisted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const app = await Application.findById(req.params.id).populate("job");
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (String(app.job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your job posting" });
    }

    app.status = status;
    await app.save();
    res.json({ application: app });
  } catch (err) {
    next(err);
  }
}

module.exports = { apply, myApplications, jobApplications, updateStatus };
