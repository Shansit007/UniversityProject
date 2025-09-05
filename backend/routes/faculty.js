const express = require('express');
const router = express.Router();
const { registerFaculty, loginFaculty, getAllFaculties, setupDashboard, updateDashboard, getDashboard } = require('../controllers/facultyController');
const facultyAuth = require('../middleware/facultyAuth'); // faculty JWT middleware

// Public routes
router.post('/register', registerFaculty);
router.post('/login', loginFaculty);

// JWT-protected route to get all faculties
router.get('/', facultyAuth, getAllFaculties);

// Setup dashboard (first login)
router.post('/setup', facultyAuth, setupDashboard);

// Update dashboard later
router.put('/update', facultyAuth, updateDashboard);

// Get dashboard data
router.get('/me', facultyAuth, getDashboard);

module.exports = router;
