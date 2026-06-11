require("dotenv").config();

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const companyRoutes = require("./routes/companies");

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();

// ─── DB ───────────────────────────────────────────────────────────────────────
connectDB();

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Rate limiting ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { message: "Too many requests, slow down." },
});
app.use("/api/auth", authLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);

// ─── API info ─────────────────────────────────────────────────────────────────
const apiRoutes = [
  { method: "GET", path: "/api", description: "List available API routes" },
  { method: "GET", path: "/api/health", description: "Health check" },
  { method: "POST", path: "/api/auth/register", description: "Register user" },
  { method: "POST", path: "/api/auth/login", description: "Login user" },
  { method: "GET", path: "/api/auth/me", description: "Get current user" },
  { method: "GET", path: "/api/jobs", description: "List jobs" },
  { method: "GET", path: "/api/jobs/featured", description: "Featured jobs" },
  { method: "GET", path: "/api/jobs/:id", description: "Get job by ID" },
  { method: "GET", path: "/api/jobs/saved/list", description: "Get saved jobs" },
  { method: "POST", path: "/api/jobs/:id/save", description: "Save or unsave a job" },
  { method: "POST", path: "/api/jobs", description: "Create job (employer only)" },
  { method: "PATCH", path: "/api/jobs/:id", description: "Update job (employer only)" },
  { method: "DELETE", path: "/api/jobs/:id", description: "Delete job (employer only)" },
  { method: "GET", path: "/api/companies", description: "List companies" },
  { method: "GET", path: "/api/companies/:id", description: "Get company by ID" },
  { method: "POST", path: "/api/companies", description: "Create company profile" },
  { method: "POST", path: "/api/applications", description: "Submit application" },
  { method: "GET", path: "/api/applications/mine", description: "Get my applications" },
  { method: "GET", path: "/api/applications/job/:jobId", description: "Get applications for a job" },
  { method: "PATCH", path: "/api/applications/:id/status", description: "Update application status" },
];

app.get("/", (_req, res) => res.json({ status: "ok", api: "/api" }));
app.get("/api", (_req, res) => res.json({ routes: apiRoutes }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
// ─── Dev debug endpoints (only in non-production) ──────────────────────────────
if (process.env.NODE_ENV !== "production") {
  const Job = require("./models/Job");

  // List recent raw jobs (including inactive)
  app.get("/api/debug/jobs", async (_req, res, next) => {
    try {
      const jobs = await Job.find().sort({ createdAt: -1 }).limit(50).lean();
      res.json({ jobs });
    } catch (err) {
      next(err);
    }
  });

  // Get raw job by id (no active check)
  app.get("/api/debug/jobs/:id", async (req, res, next) => {
    try {
      const job = await Job.findById(req.params.id).lean();
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json({ job });
    } catch (err) {
      next(err);
    }
  });
}

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found", method: req.method, path: req.originalUrl }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀  NexusWork API running on http://localhost:${PORT}`);
});
