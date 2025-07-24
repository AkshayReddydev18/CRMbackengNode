const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotpassword.controller');

router.post('/', forgotPasswordController.resetPassword); // ✅ Use the correct function name

module.exports = router;
