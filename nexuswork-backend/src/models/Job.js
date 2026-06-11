const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 120,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // Denormalised for fast listing queries
    companyName: { type: String, required: true },
    companyShort: { type: String, required: true },
    logoColor: { type: String, default: "linear-gradient(135deg,#4f8ef7,#a78bfa)" },

    salary: { type: String, required: true },        // display string e.g. "$140–185K"
    salaryMin: { type: Number, required: true },      // numeric for sorting/filtering
    salaryMax: { type: Number, required: true },

    location: { type: String, required: true },
    remote: { type: Boolean, default: false },

    tags: [{ type: String, enum: ["Remote", "Full-time", "Part-time", "Contract"] }],
    category: {
      type: String,
      enum: ["Engineering", "Design", "Data", "Product", "Marketing", "Finance", "Security", "Operations"],
      required: true,
    },

    description: { type: String, required: true, maxlength: 2000 },
    featured: { type: Boolean, default: false },

    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicationsCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Full-text search index
jobSchema.index({ title: "text", description: "text", companyName: "text" });

// Compound index for common list queries
jobSchema.index({ active: 1, createdAt: -1 });
jobSchema.index({ active: 1, category: 1 });
jobSchema.index({ active: 1, tags: 1 });

module.exports = mongoose.model("Job", jobSchema);
