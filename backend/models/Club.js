const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  clubName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  presidentName: { type: String, required: true },
  password: { type: String, required: true },
  otpVerified: { type: Boolean, default: false },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
