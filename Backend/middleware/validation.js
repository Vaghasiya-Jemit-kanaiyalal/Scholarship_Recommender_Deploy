const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(e => `${e.param}: ${e.msg}`).join(', ')
    });
  }
  next();
};

// Register validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Login validation rules
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Scholarship validation rules
const scholarshipValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Scholarship name is required')
    .isLength({ min: 5 }).withMessage('Name must be at least 5 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('amount')
    .trim()
    .notEmpty().withMessage('Amount is required'),
  body('deadline')
    .notEmpty().withMessage('Deadline is required')
    .isDate().withMessage('Please provide a valid date'),
  body('eligibility')
    .notEmpty().withMessage('Eligibility criteria is required'),
  body('required_documents')
    .notEmpty().withMessage('Required documents is required'),
];

// Profile validation rules
const profileValidation = [
  body('cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
  body('family_income')
    .optional()
    .isInt({ min: 0 }).withMessage('Family income must be a positive number'),
  body('category')
    .optional()
    .isIn(['GEN', 'OBC', 'SC', 'ST', 'Minority']).withMessage('Invalid category'),
  body('highest_education')
    .optional()
    .trim(),
  body('state')
    .optional()
    .trim(),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  scholarshipValidation,
  profileValidation,
};

