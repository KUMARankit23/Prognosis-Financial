const mongoose = require('mongoose');

const advisorTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      trim: true,
      default: 'Anonymous',
    },
    userPhone: {
      type: String,
      trim: true,
      default: '',
    },
    userEmail: {
      type: String,
      trim: true,
      default: '',
    },
    query: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    intent: {
      type: String,
      default: 'advisor_escalation',
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    assignedAdvisor: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: 2000,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdvisorTicket', advisorTicketSchema);
