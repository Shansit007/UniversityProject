const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, addToLibrary, getLibrary } = require('../controllers/studentController');
const auth = require('../middleware/auth'); // JWT middleware

// Register
router.post('/register', registerStudent);

// Login
router.post('/login', loginStudent);

// Library actions (JWT protected)
router.post('/library', auth, addToLibrary);
router.get('/library', auth, getLibrary);

module.exports = router;
