const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent } = require('../controllers/studentController');

// Register
router.post('/register', registerStudent);

// Login
router.post('/login', loginStudent);

module.exports = router;
