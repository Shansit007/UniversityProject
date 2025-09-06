const express = require('express');
const router = express.Router();
const { 
  registerFaculty, 
  loginFaculty, 
  getAllFaculties, 
  setupDashboard, 
  updateDashboard, 
  getDashboard 
} = require('../controllers/facultyController');
const facultyAuth = require('../middleware/facultyAuth'); // faculty JWT middleware

// ----------------- Public Routes -----------------
router.post('/register', registerFaculty);
router.post('/login', loginFaculty);

// Public: Students can fetch all approved + verified faculties
router.get('/', getAllFaculties);

// ----------------- Protected Routes (Faculty only) -----------------
router.post('/setup', facultyAuth, setupDashboard);   // first-time dashboard setup
router.put('/update', facultyAuth, updateDashboard);  // update later
router.get('/me', facultyAuth, getDashboard);         // faculty’s own data

module.exports = router;
