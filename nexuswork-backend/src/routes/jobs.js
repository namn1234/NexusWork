const { Router } = require("express");
const { body } = require("express-validator");
const {
  getJobs,
  getFeaturedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs,
} = require("../controllers/jobController");
const { protect, employerOnly } = require("../middleware/auth");

const router = Router();

// Public
router.get("/", getJobs);
router.get("/featured", getFeaturedJobs);
router.get("/:id", getJobById);

// Jobseeker — saved jobs
router.get("/saved/list", protect, getSavedJobs);
router.post("/:id/save", protect, toggleSaveJob);

// Employer — manage listings
router.post(
  "/",
  protect,
  employerOnly,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("companyId").notEmpty().withMessage("companyId is required"),
    body("salary").notEmpty().withMessage("Salary display string is required"),
    body("salaryMin").isNumeric().withMessage("salaryMin must be a number"),
    body("salaryMax").isNumeric().withMessage("salaryMax must be a number"),
    body("location").notEmpty().withMessage("Location is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("description").isLength({ min: 20 }).withMessage("Description too short"),
  ],
  createJob
);

router.patch("/:id", protect, employerOnly, updateJob);
router.delete("/:id", protect, employerOnly, deleteJob);

module.exports = router;
