const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes — requires a valid Bearer token.
 */
async function protect(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorised — no token" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * Restrict to employer role.
 */
function employerOnly(req, res, next) {
  if (req.user?.role !== "employer") {
    return res.status(403).json({ message: "Employers only" });
  }
  next();
}

module.exports = { protect, employerOnly };
