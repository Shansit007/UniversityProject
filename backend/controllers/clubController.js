const Club = require('../models/Club');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage & config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Accept only images (jpg/png/gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) cb(null, true);
  else cb(new Error('Only image files are allowed (jpeg, png, gif)'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

// ---------------- Register Club ----------------
const registerClub = async (req, res) => {
  try {
    const { clubName, email, presidentName, password } = req.body;
    const existing = await Club.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ msg: 'Club already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    const club = new Club({
      clubName,
      email: email.toLowerCase(),
      presidentName,
      password: hashedPw,
      otpVerified: true // dev shortcut
    });
    await club.save();
    res.json({ msg: 'Club registered. OTP verified. Awaiting admin approval.' });
  } catch (err) {
    console.error('RegisterClub error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------- Login Club ----------------
const loginClub = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ msg: 'Identifier and password required' });

    const normalized = identifier.trim();
    const club = await Club.findOne({
      $or: [
        { clubName: normalized },
        { email: normalized.toLowerCase() }
      ]
    });

    if (!club) return res.status(400).json({ msg: 'Club not found' });
    if (!club.otpVerified) return res.status(400).json({ msg: 'OTP not verified' });
    if (!club.approved) return res.status(400).json({ msg: 'Awaiting admin approval' });

    const isMatch = await bcrypt.compare(password, club.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    const token = jwt.sign({ clubId: club._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ msg: 'Login successful', club, token });
  } catch (err) {
    console.error('LoginClub error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------- Admin: get pending ----------------
const getPendingClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ approved: false });
    res.json(clubs);
  } catch (err) {
    console.error('GetPendingClubs error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------- Admin: approve ----------------
const approveClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    res.json({ msg: 'Club approved', club });
  } catch (err) {
    console.error('ApproveClub error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------- Get all approved clubs (public) ----------------
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ approved: true });
    res.json(clubs);
  } catch (err) {
    console.error('GetAllClubs error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------- Get club events (public) ----------------
const getClubEvents = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    res.json(club.events || []);
  } catch (err) {
    console.error('GetClubEvents error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------- Club => get own profile (protected) ----------------
const getMyClub = async (req, res) => {
  try {
    const club = await Club.findById(req.user.clubId);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    res.json(club);
  } catch (err) {
    console.error('GetMyClub error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------------- Add Event (protected) ----------------
// NOTE: multer middleware should be applied in route: upload.single('poster')
const addEvent = async (req, res) => {
  try {
    const club = await Club.findById(req.user.clubId);
    if (!club) return res.status(404).json({ msg: 'Club not found' });

    const { name, date, odProvided } = req.body;
    const poster = req.file ? '/uploads/' + req.file.filename : null;
    const odBool = odProvided === 'true' || odProvided === true;

    club.events.push({ name, date, poster, odProvided: odBool });
    await club.save();

    res.json({ msg: 'Event added successfully', events: club.events });
  } catch (err) {
    console.error('AddEvent error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = {
  registerClub,
  loginClub,
  getPendingClubs,
  approveClub,
  getAllClubs,
  getClubEvents,
  getMyClub,
  addEvent,
  upload // export so route can use upload.single('poster')
};
