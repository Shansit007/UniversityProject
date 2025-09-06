const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  poster: { type: String },           // URL path to uploaded poster (e.g. /uploads/xxxx.png)
  odProvided: { type: Boolean, default: false }
});

const clubSchema = new mongoose.Schema({
  clubName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  presidentName: { type: String, required: true },
  password: { type: String, required: true },
  otpVerified: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  events: [eventSchema]
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
