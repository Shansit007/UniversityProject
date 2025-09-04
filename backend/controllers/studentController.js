const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Register Student
exports.registerStudent = async (req, res) => {
  const { name, regNo, password } = req.body;
  try {
    // check existing
    const existing = await Student.findOne({ regNo });
    if (existing) return res.status(400).json({ msg: 'Student already exists' });

    // hash pw
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    // save
    const student = new Student({ name, regNo, password: hashedPw });
    await student.save();

    res.json({ msg: 'Student registered successfully. You can now Login.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Login Student
exports.loginStudent = async (req, res) => {
  const { regNo, password } = req.body;

  try {
    console.log("req.body:", req.body);   // 🔎 check what’s coming from Postman

    const student = await Student.findOne({ regNo });
    console.log("Student found:", student);  // 🔎 see if student exists in DB

    if (!student) return res.status(400).json({ msg: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    console.log("Password match result:", isMatch);  // 🔎 true/false

    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    res.json({ msg: 'Login successful', student });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
