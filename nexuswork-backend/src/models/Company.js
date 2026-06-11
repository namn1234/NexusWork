const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    short: { type: String, required: true, maxlength: 4 },
    industry: { type: String, required: true },
    logoColor: { type: String, default: "linear-gradient(135deg,#4f8ef7,#a78bfa)" },
    website: { type: String, trim: true },
    description: { type: String, maxlength: 1000 },
    // Kept in sync by a post-save hook on Job
    jobCount: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
