const express = require('express');
const router = express.Router();
const clubAuth = require('../middleware/clubAuth');
const {
  registerClub,
  loginClub,
  getPendingClubs,
  approveClub,
  getAllClubs,
  getClubEvents,
  getMyClub,
  addEvent,
  upload
} = require('../controllers/clubController');

// Public
router.post('/register', registerClub);
router.post('/login', loginClub);

// Admin-only
router.get('/pending', getPendingClubs);
router.put('/approve/:id', approveClub);

// Public: used by student dashboard
router.get('/all', getAllClubs);
router.get('/events/:id', getClubEvents);

// Protected club routes
router.get('/me', clubAuth, getMyClub);
router.post('/event', clubAuth, upload.single('poster'), addEvent);

module.exports = router;
