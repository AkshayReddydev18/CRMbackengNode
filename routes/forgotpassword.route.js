// const express = require('express');
// const router = express.Router();
// const forgotPasswordController = require('../controllers/forgotpassword.controller');

// router.post('/', forgotPasswordController.resetPassword); 
// module.exports = router;
const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotpassword.controller');

// Request reset (get token)
router.post('/request', forgotPasswordController.requestReset);
// Reset password (use token)
router.post('/reset', forgotPasswordController.resetPassword);

module.exports = router;