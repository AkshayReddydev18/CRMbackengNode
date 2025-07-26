const express = require('express');
const router = express.Router();
const employeelogin = require('../controllers/employeelogin.controller');
const forgotPasswordController = require('../controllers/employeelogin.controller');



// POST /api/login
router.post('/login', employeelogin.login);
// POST /api/signup
router.post('/signup', employeelogin.signup);

// Request reset (get token)
router.post('/request', forgotPasswordController.requestReset);
// Reset password (use token)
router.post('/reset', forgotPasswordController.resetPassword);



module.exports = router;