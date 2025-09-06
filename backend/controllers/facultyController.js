const Faculty = require('../models/Faculty');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// ============================
// Register Faculty
// ============================
exports.registerFaculty = async (req, res) => {
  const { name, mobile, email, facultyID, password } = req.body;

  try {
    // Check existing
    const existing = await Faculty.findOne({ $or: [{ email }, { facultyID }] });
    if (existing) return res.status(400).json({ msg: 'Faculty already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    // Save
    const faculty = new Faculty({ name, mobile, email, facultyID, password: hashedPw });
    await faculty.save();

    // Simulate OTP verification (for dev)
    faculty.otpVerified = true;
    await faculty.save();

    res.json({ msg: 'Faculty registered. OTP verified. Await admin approval.' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send('Server error');
  }
};

// ============================
// Login Faculty
// ============================
exports.loginFaculty = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const { facultyID, password } = req.body;

    if (!facultyID || !password) {
      return res.status(400).json({ msg: "FacultyID and password are required" });
    }

    // Look up faculty by facultyID only
    const faculty = await Faculty.findOne({ facultyID: facultyID.trim() });

    if (!faculty) {
      console.log("Faculty not found with ID:", facultyID);
      return res.status(400).json({ msg: "Faculty not found" });
    }

    // Check OTP + approval
    if (!faculty.otpVerified) {
      return res.status(400).json({ msg: "OTP not verified" });
    }
    if (!faculty.approved) {
      return res.status(400).json({ msg: "Awaiting admin approval" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { facultyId: faculty._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token + faculty
    res.status(200).json({
      success: true,
      msg: "Login successful",
      token: token,
      faculty: faculty
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============================
// Search faculties by name
// ============================
exports.searchFaculty = async (req, res) => {
  const name = req.query.name;
  try {
    const faculties = await Faculty.find({ name: { $regex: name, $options: 'i' }, approved: true });
    res.json(faculties);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).send('Server error');
  }
};

// ============================
// Get all faculties (for students to view)
// ============================
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find(
      { approved: true, otpVerified: true },
      "-password" // exclude password field
    );
    res.json(faculties);
  } catch (err) {
    console.error("Get all faculties error:", err);
    res.status(500).send("Server error");
  }
};


// ============================
// Setup dashboard (first login)
// ============================
exports.setupDashboard = async (req, res) => {
  const { cabin, freeSlots, note } = req.body;
  try {
    const faculty = await Faculty.findById(req.user.facultyId);
    if (!faculty) {
      return res.status(404).json({ msg: "Faculty not found" });
    }

    faculty.cabin = cabin;
    faculty.freeSlots = freeSlots;
    faculty.note = note;
    await faculty.save();

    const safeFaculty = faculty.toObject();
    delete safeFaculty.password;

    res.json({ msg: "Dashboard setup successful", faculty: safeFaculty });
  } catch (err) {
    console.error("Setup dashboard error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


exports.updateDashboard = async (req, res) => {
  const { cabin, freeSlots, note } = req.body;
  try {
    const faculty = await Faculty.findById(req.user.facultyId);
    if (!faculty) {
      return res.status(404).json({ msg: "Faculty not found" });
    }

    if (cabin !== undefined) faculty.cabin = cabin;
    if (freeSlots !== undefined) faculty.freeSlots = freeSlots;
    if (note !== undefined) faculty.note = note;

    await faculty.save();

    const safeFaculty = faculty.toObject();
    delete safeFaculty.password;

    res.json({ msg: "Dashboard updated", faculty: safeFaculty });
  } catch (err) {
    console.error("Update dashboard error:", err);
    res.status(500).send("Server error");
  }
};


// ============================
// Get dashboard data
// ============================
exports.getDashboard = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.facultyId).select("-password");
    if (!faculty) {
      return res.status(404).json({ msg: "Faculty not found" });
    }
    res.json(faculty);
  } catch (err) {
    console.error("Get dashboard error:", err);
    res.status(500).send("Server error");
  }
};

