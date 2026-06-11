const Company = require("../models/Company");
const Job = require("../models/Job");

// GET /api/companies
async function getCompanies(req, res, next) {
  try {
    const companies = await Company.find().sort({ jobCount: -1 }).lean();
    res.json({ companies });
  } catch (err) {
    next(err);
  }
}

// GET /api/companies/:id
async function getCompanyById(req, res, next) {
  try {
    const company = await Company.findById(req.params.id).lean();
    if (!company) return res.status(404).json({ message: "Company not found" });

    const jobs = await Job.find({ company: company._id, active: true })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ company, jobs });
  } catch (err) {
    next(err);
  }
}

// POST /api/companies  (employer only)
async function createCompany(req, res, next) {
  try {
    const { name, short, industry, logoColor, website, description } = req.body;
    const company = await Company.create({
      name,
      short,
      industry,
      logoColor,
      website,
      description,
      owner: req.user._id,
    });
    res.status(201).json({ company });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCompanies, getCompanyById, createCompany };
