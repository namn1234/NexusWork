const { Router } = require("express");
const { getCompanies, getCompanyById, createCompany } = require("../controllers/companyController");
const { protect, employerOnly } = require("../middleware/auth");

const router = Router();

router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.post("/", protect, employerOnly, createCompany);

module.exports = router;
