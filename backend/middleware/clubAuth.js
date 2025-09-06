// middleware/clubAuth.js
const jwt = require('jsonwebtoken');
const Club = require('../models/Club');

module.exports = async function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const club = await Club.findById(decoded.clubId);
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    if (!club.otpVerified || !club.approved) {
      return res.status(403).json({ msg: 'Club not verified or approved' });
    }

    req.user = { clubId: club._id }; // attach clubId to req.user
    next();
  } catch (err) {
    console.error('Club auth error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
