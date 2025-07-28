
const express = require('express');
const router = express.Router();
const employeelogin = require('../controllers/employeelogin.controller');
const upload = require('../middlewares/upload'); // Import multer middleware if profile photo is required

// Login route
router.post('/login', employeelogin.login);

// Signup route with profile photo upload
router.post('/signup', upload.single('photo'), employeelogin.signup);

// Request password reset OTP
router.post('/request', employeelogin.requestReset);

// Reset password using OTP
router.post('/reset', employeelogin.resetPassword);

module.exports = router;
