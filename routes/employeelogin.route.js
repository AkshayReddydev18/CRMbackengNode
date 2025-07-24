const express = require('express');
const router = express.Router();
const employeelogin = require('../controllers/employeelogin.controller');
// const signupController = require('../controllers/employeelogin.controller');


// POST /api/login
router.post('/login', employeelogin.login);
// POST /api/signup
router.post('/signup', employeelogin.signup);

module.exports = router;