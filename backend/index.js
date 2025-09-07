const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected to UniversityCluster"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, "frontend")));

// API routes can be added here
// Example: app.use("/api/faculty", facultyRoutes);

// Fallback route — serve index.html for any unmatched route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
