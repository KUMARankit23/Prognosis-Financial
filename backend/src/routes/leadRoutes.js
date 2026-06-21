const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { createLead, getLeads, updateLead } = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

// Public - create lead from chatbot
router.post(
  '/',
  chatLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }),
    body('phone').trim().notEmpty().withMessage('Phone is required.').matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number.'),
    body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Enter a valid email.').normalizeEmail(),
    body('investmentGoal').optional().isIn(['wealth_creation', 'retirement', 'education', 'home', 'emergency_fund', 'tax_saving', 'other']),
    body('sessionId').optional().isString().isLength({ max: 100 }),
  ],
  validate,
  createLead
);

// Admin protected routes
router.get('/', protect, getLeads);
router.patch('/:id', protect, updateLead);

module.exports = router;
