
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // JWT middleware
const { 
  registerClub, 
  loginClub, 
  getPendingClubs, 
  approveClub, 
  getAllClubs, 
  getClubEvents 
} = require('../controllers/clubController');

// Public routes
router.post('/register', registerClub);
router.post('/login', loginClub);

// Admin-only routes
router.get('/pending', getPendingClubs);
router.put('/approve/:id', approveClub);

// JWT-protected routes for student dashboard
router.get('/all', auth, getAllClubs);         // Fetch all approved clubs
router.get('/events/:id', auth, getClubEvents);

module.exports = router;
