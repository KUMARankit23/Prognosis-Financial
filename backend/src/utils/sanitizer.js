const xss = require('xss');
const validator = require('validator');

/**
 * Sanitize a user message to prevent XSS and prompt injection
 * @param {string} message
 * @returns {string}
 */
function sanitizeMessage(message) {
  if (typeof message !== 'string') return '';

  // Strip HTML tags / XSS
  let clean = xss(message, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
  });

  // Normalize whitespace
  clean = clean.replace(/\s+/g, ' ').trim();

  // Limit length
  clean = clean.substring(0, 2000);

  // Detect and neutralize prompt injection attempts
  const injectionPatterns = [
    /ignore\s+(previous|above|all)\s+instructions/i,
    /forget\s+(your|all)\s+(instructions|rules|guidelines)/i,
    /you\s+are\s+now\s+a\s+different/i,
    /act\s+as\s+(a\s+)?(different|new|unrestricted)/i,
    /jailbreak/i,
    /dan\s+mode/i,
    /pretend\s+you\s+(are|have\s+no)/i,
    /system\s+prompt/i,
    /reveal\s+(your\s+)?(instructions|prompt|system)/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(clean)) {
      return "I can only help with financial information related to SIPs, Mutual Funds, Demat Accounts, Insurance, and Goal-Based Investing.";
    }
  }

  return clean;
}

/**
 * Sanitize and validate lead data
 */
function sanitizeLeadData(data) {
  return {
    name: data.name ? xss(validator.trim(data.name)).substring(0, 100) : '',
    phone: data.phone ? validator.trim(data.phone) : '',
    email: data.email ? validator.normalizeEmail(validator.trim(data.email)) || '' : '',
    investmentGoal: data.investmentGoal || 'other',
  };
}

/**
 * Validate phone number (Indian format)
 */
function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Validate email
 */
function validateEmail(email) {
  return validator.isEmail(email);
}

module.exports = { sanitizeMessage, sanitizeLeadData, validatePhone, validateEmail };
