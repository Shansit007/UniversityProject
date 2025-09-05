const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const Club = require('../models/Club');

// Get all pending approvals
router.get('/pending', async (req, res) => {
  try {
    const pendingFaculty = await Faculty.find({ approved: false, otpVerified: true });
    const pendingClubs = await Club.find({ approved: false, otpVerified: true });
    res.json({ pendingFaculty, pendingClubs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ Approve a faculty
router.put('/approve/faculty/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!faculty) return res.status(404).json({ msg: 'Faculty not found' });

    res.json({ msg: 'Faculty approved successfully', faculty });
  } catch (err) {
    console.error('Error approving faculty:', err);
    res.status(500).send('Server error');
  }
});


// ✅ Approve a club
router.put('/approve/club/:clubName', async (req, res) => {
  try {
    const club = await Club.findOneAndUpdate(
      { clubName: req.params.clubName },
      { approved: true },
      { new: true }
    );
    if (!club) return res.status(404).json({ msg: 'Club not found' });
    res.json({ msg: 'Club approved successfully', club });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
