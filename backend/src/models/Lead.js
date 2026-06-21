const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    investmentGoal: {
      type: String,
      enum: ['wealth_creation', 'retirement', 'education', 'home', 'emergency_fund', 'tax_saving', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    priorityReason: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
      default: 'new',
    },
    notes: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    source: {
      type: String,
      default: 'chatbot',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
