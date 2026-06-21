const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Message = require('../models/Message');
const Lead = require('../models/Lead');
const AdvisorTicket = require('../models/AdvisorTicket');
const FollowUp = require('../models/FollowUp');
const { classifyIntent, scorePriority } = require('../services/intentClassifier');
const { generateResponse } = require('../services/geminiService');
const { sanitizeMessage } = require('../utils/sanitizer');
const logger = require('../utils/logger');

/**
 * POST /api/chat/message
 * Send a message and get AI response
 */
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const sid = sessionId || uuidv4();
    const cleanMessage = sanitizeMessage(message);

    // Get or create user session
    let user = await User.findOne({ sessionId: sid });
    if (!user) {
      user = await User.create({ sessionId: sid });
    }

    // Classify intent
    const { intent, escalate, priority, priorityReason } = classifyIntent(cleanMessage);

    // Fetch recent conversation history for context
    const history = await Message.find({ sessionId: sid })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    const conversationHistory = history.reverse();

    // Generate AI response
    const aiResponse = await generateResponse(cleanMessage, conversationHistory, intent, escalate);

    // Save user message
    await Message.create({
      sessionId: sid,
      role: 'user',
      content: cleanMessage,
      intent,
      escalated: escalate,
      metadata: { priority },
    });

    // Save assistant message
    await Message.create({
      sessionId: sid,
      role: 'assistant',
      content: aiResponse,
      intent,
      escalated: escalate,
    });

    // Update user stats
    await User.findOneAndUpdate(
      { sessionId: sid },
      { $inc: { totalMessages: 2 }, lastActive: new Date() }
    );

    // Create advisor ticket if escalation triggered
    let ticket = null;
    if (escalate) {
      const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      ticket = await AdvisorTicket.create({
        ticketId,
        sessionId: sid,
        userName: user.name || 'Anonymous',
        userPhone: user.phone || '',
        userEmail: user.email || '',
        query: cleanMessage,
        intent,
        priority,
      });
      logger.info(`Advisor ticket created: ${ticketId} for session: ${sid}`);
    }

    // BUG-03 fix: Create FollowUp record when follow_up_query intent is detected.
    // TC-11 ("Call me back please") now correctly creates a pending follow-up in the database.
    let followUpRecord = null;
    if (intent === 'follow_up_query') {
      const lead = await Lead.findOne({ sessionId: sid });
      const followUpData = {
        sessionId: sid,
        userName: user.name || 'Anonymous',
        userPhone: user.phone || '',
        userEmail: user.email || '',
        reason: cleanMessage,
        channel: 'call',
        status: 'pending',
      };
      // Attach leadId only when a lead exists (makes leadId optional safe)
      if (lead?._id) followUpData.leadId = lead._id;

      followUpRecord = await FollowUp.create(followUpData);

      // Sync lead follow-up tracking
      if (lead) {
        await Lead.findByIdAndUpdate(lead._id, {
          followUpStatus: 'pending',
          $inc: { followUpCount: 1 },
        });
      }

      logger.info(`Follow-up record created from chat: ${followUpRecord._id} for session: ${sid}`);
    }

    // Update lead priority if lead exists
    if (user.leadCaptured) {
      const leadPriorityScore = scorePriority(cleanMessage);
      if (leadPriorityScore.priority === 'high') {
        await Lead.findOneAndUpdate(
          { sessionId: sid },
          { priority: 'high', priorityReason: leadPriorityScore.priorityReason }
        );
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: sid,
        response: aiResponse,
        intent,
        escalated: escalate,
        ticket: ticket ? { ticketId: ticket.ticketId, status: ticket.status } : null,
        followUp: followUpRecord ? { followUpId: followUpRecord._id, status: followUpRecord.status } : null,
      },
    });
  } catch (error) {
    logger.error(`Chat controller error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to process message.' });
  }
};

/**
 * GET /api/chat/history/:sessionId
 * Get conversation history for a session
 */
const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .select('-__v')
      .lean();

    return res.status(200).json({
      success: true,
      data: { sessionId, messages, count: messages.length },
    });
  } catch (error) {
    logger.error(`Get history error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch conversation history.' });
  }
};

module.exports = { sendMessage, getHistory };
