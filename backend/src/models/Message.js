const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    intent: {
      type: String,
      enum: [
        'sip_query',
        'mutual_fund_query',
        'demat_query',
        'insurance_query',
        'goal_planning_query',
        'wealth_creation_query',
        'general_query',
        'advisor_escalation',
        'lead_capture',
        'greeting',
      ],
      default: 'general_query',
    },
    escalated: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

messageSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
