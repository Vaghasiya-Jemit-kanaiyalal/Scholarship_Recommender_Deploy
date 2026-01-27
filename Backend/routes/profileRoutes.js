const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');
const { profileValidation, validate } = require('../middleware/validation');

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', authenticateToken, getProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', authenticateToken, profileValidation, validate, updateProfile);

module.exports = router;

