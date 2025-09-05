const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true, unique: true }, // VIT Reg No
  password: { type: String, required: true },
  library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
