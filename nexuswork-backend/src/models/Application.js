const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Snapshot of key job info (survives job deletion)
    jobTitle: String,
    companyName: String,

    // Form fields from ApplyModal
    name: { type: String, required: true },
    email: { type: String, required: true },
    portfolioUrl: String,
    coverLetter: String,
    availability: {
      type: String,
      enum: ["Immediately", "2 weeks notice", "1 month notice", "Flexible"],
      default: "Immediately",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// One application per job per user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
