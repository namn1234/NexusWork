const mongoose = require("mongoose");

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/nexuswork";

async function connectDB() {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  if (!process.env.MONGODB_URI) {
    console.warn(
      "⚠️  MONGODB_URI is not defined. Falling back to local MongoDB at:",
      DEFAULT_MONGODB_URI
    );
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅  MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("❌  MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
