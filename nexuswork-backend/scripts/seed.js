/**
 * Seed script — run with: npm run seed
 * Populates the database with the sample companies and jobs from the frontend data.ts
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Company = require("../src/models/Company");
const Job = require("../src/models/Job");
const User = require("../src/models/User");

const COMPANIES_DATA = [
  { name: "Google",     short: "G",  industry: "Tech",    col: "linear-gradient(135deg,#1a6ef7,#7c3aed)" },
  { name: "Apple",      short: "Ap", industry: "Tech",    col: "linear-gradient(135deg,#374151,#1f2937)" },
  { name: "Amazon",     short: "Am", industry: "Tech",    col: "linear-gradient(135deg,#059669,#06b6d4)" },
  { name: "Meta",       short: "Me", industry: "Tech",    col: "linear-gradient(135deg,#1d4ed8,#4f46e5)" },
  { name: "Netflix",    short: "Nt", industry: "Media",   col: "linear-gradient(135deg,#dc2626,#ea580c)" },
  { name: "OpenAI",     short: "Oa", industry: "Tech",    col: "linear-gradient(135deg,#0891b2,#1d4ed8)" },
  { name: "Stripe",     short: "St", industry: "Finance", col: "linear-gradient(135deg,#4f46e5,#7c3aed)" },
  { name: "Vercel",     short: "Ve", industry: "Cloud",   col: "linear-gradient(135deg,#111,#444)" },
  { name: "Figma",      short: "Fi", industry: "Tech",    col: "linear-gradient(135deg,#ec4899,#8b5cf6)" },
  { name: "Cloudflare", short: "Cf", industry: "Cloud",   col: "linear-gradient(135deg,#b45309,#d97706)" },
  { name: "Airbnb",     short: "Ab", industry: "Tech",    col: "linear-gradient(135deg,#ef4444,#f97316)" },
  { name: "Notion",     short: "No", industry: "Tech",    col: "linear-gradient(135deg,#374151,#6b7280)" },
  { name: "Loom",       short: "Lo", industry: "Tech",    col: "linear-gradient(135deg,#7c3aed,#4f46e5)" },
  { name: "Linear",     short: "Li", industry: "Tech",    col: "linear-gradient(135deg,#7c3aed,#ec4899)" },
  { name: "Spotify",    short: "Sp", industry: "Media",   col: "linear-gradient(135deg,#059669,#06b6d4)" },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅  Connected to MongoDB");

  // Wipe existing seed data
  await Promise.all([Company.deleteMany({}), Job.deleteMany({}), User.deleteMany({ email: "seed@nexuswork.dev" })]);

  // Create a seed employer user
  const employer = await User.create({
    name: "NexusWork Admin",
    email: "seed@nexuswork.dev",
    password: "nexus1234",
    role: "employer",
  });

  // Insert companies
  const companyDocs = await Company.insertMany(
    COMPANIES_DATA.map((c) => ({
      name: c.name,
      short: c.short,
      industry: c.industry,
      logoColor: c.col,
      owner: employer._id,
    }))
  );

  const byName = Object.fromEntries(companyDocs.map((c) => [c.name, c]));

  const JOBS_DATA = [
    { title: "Senior Product Designer",    co: "Stripe",     salary: "$140–185K", min: 140, max: 185, loc: "🌎 Worldwide",      tags: ["Remote","Full-time"],  cat: "Design",       featured: true,  desc: "Shape the future of financial infrastructure. Own end-to-end design for core payment flows." },
    { title: "Staff Engineer — Platform",  co: "Spotify",    salary: "$210–270K", min: 210, max: 270, loc: "🇸🇪 Stockholm",     tags: ["Remote","Full-time"],  cat: "Engineering",  featured: false, desc: "Lead architecture decisions for Spotify's streaming infrastructure serving 600M users." },
    { title: "ML Engineer — Recommendations", co: "Netflix", salary: "$180–240K", min: 180, max: 240, loc: "🇺🇸 Los Gatos",    tags: ["Contract","Remote"],   cat: "Data",         featured: true,  desc: "Build the algorithms that connect 260M viewers with content they love every night." },
    { title: "Frontend Engineer",          co: "Linear",     salary: "$130–160K", min: 130, max: 160, loc: "🌎 Fully Remote",   tags: ["Remote","Full-time"],  cat: "Engineering",  featured: false, desc: "Craft the fastest, most delightful project management experience ever built." },
    { title: "DevRel Engineer",            co: "Vercel",     salary: "$100–130K", min: 100, max: 130, loc: "🌎 Worldwide",      tags: ["Part-time","Remote"],  cat: "Engineering",  featured: false, desc: "Evangelize Next.js and the web platform to developers worldwide." },
    { title: "Security Researcher",        co: "Cloudflare", salary: "$155–195K", min: 155, max: 195, loc: "🇺🇸 San Francisco", tags: ["Full-time"],           cat: "Security",     featured: true,  desc: "Protect the internet at scale. Investigate threats for 20% of all web traffic." },
    { title: "Product Manager — Growth",   co: "Figma",      salary: "$145–190K", min: 145, max: 190, loc: "🇺🇸 New York",     tags: ["Full-time","Remote"],  cat: "Product",      featured: false, desc: "Drive activation and retention for Figma's 8M+ user base. Data-driven mindset required." },
    { title: "Data Scientist",             co: "Airbnb",     salary: "$160–200K", min: 160, max: 200, loc: "🇺🇸 San Francisco", tags: ["Full-time"],           cat: "Data",         featured: false, desc: "Unlock insights that shape how 150M travellers find their next stay worldwide." },
    { title: "Brand Designer",             co: "Notion",     salary: "$110–145K", min: 110, max: 145, loc: "🌎 Remote",         tags: ["Remote","Full-time"],  cat: "Design",       featured: false, desc: "Define and evolve Notion's visual identity across every touchpoint, digital and physical." },
    { title: "Growth Marketing Lead",      co: "Loom",       salary: "$95–130K",  min: 95,  max: 130, loc: "🌎 Remote",         tags: ["Remote","Full-time"],  cat: "Marketing",    featured: false, desc: "Own acquisition funnels and growth experiments for one of the fastest-growing SaaS tools." },
  ];

  await Job.insertMany(
    JOBS_DATA.map((j) => {
      const company = byName[j.co];
      return {
        title: j.title,
        company: company._id,
        companyName: company.name,
        companyShort: company.short,
        logoColor: company.logoColor,
        salary: j.salary,
        salaryMin: j.min,
        salaryMax: j.max,
        location: j.loc,
        remote: j.tags.includes("Remote"),
        tags: j.tags,
        category: j.cat,
        description: j.desc,
        featured: j.featured,
        postedBy: employer._id,
        active: true,
      };
    })
  );

  // Update company job counts
  for (const doc of companyDocs) {
    const count = await Job.countDocuments({ company: doc._id });
    await Company.findByIdAndUpdate(doc._id, { jobCount: count });
  }

  console.log(`✅  Seeded ${companyDocs.length} companies and ${JOBS_DATA.length} jobs`);
  console.log("    Employer login: seed@nexuswork.dev / nexus1234");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
