// controllers/clubController.js
const Club = require('../models/Club');
const bcrypt = require('bcryptjs');

// Register Club
exports.registerClub = async (req, res) => {
  const { clubName, email, presidentName, password } = req.body;

  try {
    // check if exists
    const existing = await Club.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Club already exists' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    // save
    const club = new Club({
      clubName,
      email,
      presidentName,
      password: hashedPw,
      otpVerified: true, // dev shortcut
    });
    await club.save();

    res.json({ msg: 'Club registered. OTP verified. Awaiting admin approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Login Club
exports.loginClub = async (req, res) => {
  const { email, password } = req.body;

  try {
    const club = await Club.findOne({ email });
    if (!club) return res.status(400).json({ msg: 'Club not found' });
    if (!club.otpVerified) return res.status(400).json({ msg: 'OTP not verified' });
    if (!club.approved) return res.status(400).json({ msg: 'Awaiting admin approval' });

    const isMatch = await bcrypt.compare(password, club.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    res.json({ msg: 'Login successful', club });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get pending clubs (admin only)
exports.getPendingClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ otpVerified: true, approved: false });
    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Approve club (admin only)
exports.approveClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!club) return res.status(404).json({ msg: 'Club not found' });

    res.json({ msg: 'Club approved', club });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all approved clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ approved: true });
    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get events of a club
exports.getClubEvents = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('events'); // add events array in schema
    res.json(club.events || []);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
