const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ------------------- REGISTER -------------------
exports.registerStudent = async (req, res) => {
  const { name, regNo, email, password } = req.body;
  try {
    // Check if student already exists
    const existing = await Student.findOne({ regNo });
    if (existing) return res.status(400).json({ msg: 'Student already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    // Save new student
    const student = new Student({ name, regNo, email, password: hashedPw });
    await student.save();

    res.json({ msg: 'Student registered successfully. You can now login.' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).send('Server error');
  }
};

// ------------------- LOGIN -------------------
exports.loginStudent = async (req, res) => {
  const { identifier, password } = req.body; // identifier = name / email / regNo
  try {
    console.log('Login attempt:', identifier);

    // Find student by regNo, name, or email
    const student = await Student.findOne({
      $or: [
        { regNo: identifier },
        { name: identifier },
        { email: identifier }
      ]
    });

    if (!student) return res.status(400).json({ msg: 'Student not found' });

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    // Sign JWT
    const payload = { id: student._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Return student info + token
    res.json({ msg: 'Login successful', student, token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Server error');
  }
};

// ------------------- ADD FACULTY TO LIBRARY -------------------
exports.addToLibrary = async (req, res) => {
  const { facultyId } = req.body;
  const studentId = req.student.id; // req.student set by JWT middleware

  try {
    const student = await Student.findById(studentId);
    if (!student.library) student.library = [];

    if (!student.library.includes(facultyId)) {
      student.library.push(facultyId);
      await student.save();
    }

    res.json({ msg: 'Added to library' });
  } catch (err) {
    console.error('Add to Library Error:', err);
    res.status(500).send('Server error');
  }
};

// ------------------- GET STUDENT'S LIBRARY -------------------
exports.getLibrary = async (req, res) => {
  const studentId = req.student.id; // req.student set by JWT middleware

  try {
    const student = await Student.findById(studentId).populate('library');
    res.json(student.library);
  } catch (err) {
    console.error('Get Library Error:', err);
    res.status(500).send('Server error');
  }
};
