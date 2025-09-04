const Faculty = require('../models/Faculty');
const bcrypt = require('bcryptjs');

// Register Faculty
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
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Login Faculty
exports.loginFaculty = async (req, res) => {
  const { identifier, password } = req.body; // identifier = name or facultyID

console.log('req.body:', req.body);
console.log('typeof password:', typeof password);
console.log('password:', `"${password}"`); // quotes help see spaces


  try {
    const faculty = await Faculty.findOne({ $or: [{ name: identifier }, { facultyID: identifier }] });
    if (!faculty) {
      console.log('Faculty not found');
      return res.status(400).json({ msg: 'Faculty not found' });
    }

    console.log('Faculty found:', faculty);

    if (!faculty.otpVerified) return res.status(400).json({ msg: 'OTP not verified' });
    if (!faculty.approved) return res.status(400).json({ msg: 'Awaiting admin approval' });

    const isMatch = await bcrypt.compare(password, faculty.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    res.json({ msg: 'Login successful', faculty });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
