const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createFollowUp, getFollowUps, updateFollowUp } = require('../controllers/followUpController');
const { protect } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

// Public — user can request follow-up from chatbot
router.post(
  '/',
  chatLimiter,
  [
    body('sessionId').optional().isString(),
    body('leadId').optional().isString(),
    body('reason').optional().isString().isLength({ max: 500 }),
    body('channel').optional().isIn(['call', 'email', 'whatsapp', 'in_app', 'other']),
  ],
  validate,
  createFollowUp
);

// Admin protected
router.get('/', protect, getFollowUps);
router.patch('/:id', protect, updateFollowUp);

module.exports = router;
