// routes/club.js
const express = require('express');
const router = express.Router();
const { registerClub, loginClub, getPendingClubs, approveClub } = require('../controllers/clubController');

// Public routes
router.post('/register', registerClub);
router.post('/login', loginClub);

// Admin-only routes
router.get('/pending', getPendingClubs);
router.put('/approve/:id', approveClub);

module.exports = router;
