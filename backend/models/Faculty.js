const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  facultyID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otpVerified: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  cabin: String,
  freeSlots: [{ type: String }], // array of selected slots
  note: String
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
