const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    userName: { type: String, default: 'Anonymous' },
    userPhone: { type: String, default: '' },
    userEmail: { type: String, default: '' },

    // Follow-up details
    reason: { type: String, maxlength: 500, default: '' },
    scheduledAt: { type: Date },
    completedAt: { type: Date },

    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'escalated', 'cancelled'],
      default: 'pending',
    },

    channel: {
      type: String,
      enum: ['call', 'email', 'whatsapp', 'in_app', 'other'],
      default: 'call',
    },

    assignedTo: { type: String, default: '' },
    notes: { type: String, maxlength: 1000, default: '' },
    outcome: { type: String, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FollowUp', followUpSchema);
