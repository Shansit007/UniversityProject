const express = require('express');
const router = express.Router();
const { registerFaculty, loginFaculty } = require('../controllers/facultyController');

router.post('/register', registerFaculty);
router.post('/login', loginFaculty);

module.exports = router;
