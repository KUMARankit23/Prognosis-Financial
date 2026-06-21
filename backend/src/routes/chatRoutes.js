const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { sendMessage, getHistory } = require('../controllers/chatController');
const { chatLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

router.post(
  '/message',
  chatLimiter,
  [
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required.')
      .isLength({ max: 2000 }).withMessage('Message too long (max 2000 chars).'),
    body('sessionId')
      .optional()
      .isString()
      .isLength({ max: 100 }),
  ],
  validate,
  sendMessage
);

router.get(
  '/history/:sessionId',
  [param('sessionId').isString().isLength({ min: 1, max: 100 })],
  validate,
  getHistory
);

module.exports = router;
