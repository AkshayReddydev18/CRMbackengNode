const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

// POST /api/login
router.post('/', loginController.login);

module.exports = router;