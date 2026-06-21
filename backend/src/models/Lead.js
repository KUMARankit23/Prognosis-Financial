const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },

    // Basic contact info
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    phone: { type: String, required: [true, 'Phone is required'], trim: true, match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'] },
    email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Enter a valid email'] },

    // Extended Customer Profile (CIP requirement)
    investmentGoal: { type: String, enum: ['wealth_creation', 'retirement', 'education', 'home', 'emergency_fund', 'tax_saving', 'other'], default: 'other' },
    riskProfile: { type: String, enum: ['conservative', 'moderate', 'aggressive', 'not_specified'], default: 'not_specified' },
    productInterest: [{ type: String, enum: ['sip', 'mutual_fund', 'demat', 'health_insurance', 'term_insurance', 'goal_planning', 'wealth_management', 'other'] }],
    investmentHorizon: { type: String, enum: ['short_term', 'medium_term', 'long_term', 'not_specified'], default: 'not_specified' },

    // Lead Priority (CIP requirement)
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    priorityReason: { type: String, default: '' },

    // Lead Status
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], default: 'new' },
    notes: { type: String, maxlength: 1000, default: '' },
    source: { type: String, default: 'chatbot' },

    // Engagement Monitoring (CIP requirement)
    engagementScore: { type: Number, default: 0, min: 0, max: 100 },
    totalConversations: { type: Number, default: 1 },
    advisorEscalationCount: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },

    // Follow-Up Management (CIP requirement)
    followUpStatus: { type: String, enum: ['none', 'pending', 'scheduled', 'completed', 'escalated'], default: 'none' },
    followUpCount: { type: Number, default: 0 },
    followUpDate: { type: Date },
    followUpNotes: { type: String, default: '' },
    reEngagementRequired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
