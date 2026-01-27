const express = require('express');
const router = express.Router();
const {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} = require('../controllers/scholarshipController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { scholarshipValidation, validate } = require('../middleware/validation');

// @route   GET /api/scholarships
// @desc    Get all scholarships with match percentage
// @access  Private
router.get('/', authenticateToken, getAllScholarships);

// @route   GET /api/scholarships/:id
// @desc    Get single scholarship
// @access  Private
router.get('/:id', authenticateToken, getScholarshipById);

// @route   POST /api/scholarships
// @desc    Create scholarship (Admin only)
// @access  Private/Admin
router.post('/', authenticateToken, isAdmin, scholarshipValidation, validate, createScholarship);

// @route   PUT /api/scholarships/:id
// @desc    Update scholarship (Admin only)
// @access  Private/Admin
router.put('/:id', authenticateToken, isAdmin, scholarshipValidation, validate, updateScholarship);

// @route   DELETE /api/scholarships/:id
// @desc    Delete scholarship (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticateToken, isAdmin, deleteScholarship);

module.exports = router;

