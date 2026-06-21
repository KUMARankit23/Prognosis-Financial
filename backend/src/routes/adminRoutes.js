const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, getStats, getAdvisorTickets, updateTicket, getUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

router.post(
  '/login',
  authLimiter,
  [
    body('email').trim().notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 6 }),
  ],
  validate,
  login
);

router.get('/stats', protect, getStats);
router.get('/users', protect, getUsers);
router.get('/advisor-tickets', protect, getAdvisorTickets);
router.patch('/advisor-tickets/:id', protect, updateTicket);

module.exports = router;
