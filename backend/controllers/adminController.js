const Faculty = require('../models/Faculty');
const Club = require('../models/Club');

// Get pending requests
exports.getPending = async (req, res) => {
  try {
    const pendingFaculty = await Faculty.find({ approved: false });
    const pendingClubs = await Club.find({ approved: false });
    res.json({ pendingFaculty, pendingClubs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Approve faculty
exports.approveFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ msg: 'Faculty not found' });
    faculty.approved = true;
    await faculty.save();
    res.json({ msg: 'Faculty approved' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Reject faculty
exports.rejectFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ msg: 'Faculty not found' });
    await faculty.remove();
    res.json({ msg: 'Faculty rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
