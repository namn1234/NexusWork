const { Router } = require("express");
const { body } = require("express-validator");
const {
  apply,
  myApplications,
  jobApplications,
  updateStatus,
} = require("../controllers/applicationController");
const { protect, employerOnly } = require("../middleware/auth");

const router = Router();

// Jobseeker
router.post(
  "/",
  protect,
  [
    body("jobId").notEmpty().withMessage("jobId is required"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
  ],
  apply
);
router.get("/mine", protect, myApplications);

// Employer
router.get("/job/:jobId", protect, employerOnly, jobApplications);
router.patch("/:id/status", protect, employerOnly, updateStatus);

module.exports = router;
