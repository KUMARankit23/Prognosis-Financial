const Lead = require('../models/Lead');
const User = require('../models/User');
const { sanitizeLeadData, validatePhone, validateEmail } = require('../utils/sanitizer');
const { scorePriority } = require('../services/intentClassifier');
const logger = require('../utils/logger');

/**
 * POST /api/leads
 * Capture a new lead from chatbot
 */
const createLead = async (req, res) => {
  try {
    const { sessionId, name, phone, email, investmentGoal, context } = req.body;

    // Validate required fields
    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and email are required.',
      });
    }

    // Sanitize inputs
    const sanitized = sanitizeLeadData({ name, phone, email, investmentGoal });

    // Validate phone
    if (!validatePhone(sanitized.phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number.',
      });
    }

    // Validate email
    if (!validateEmail(sanitized.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
    }

    // Score priority based on investment goal and context
    const contextText = `${investmentGoal || ''} ${context || ''}`;
    const { priority, priorityReason } = scorePriority(contextText);

    // Override priority for high-value goals
    let finalPriority = priority;
    let finalReason = priorityReason;
    if (['retirement', 'wealth_creation'].includes(sanitized.investmentGoal)) {
      finalPriority = 'high';
      finalReason = `High-value investment goal: ${sanitized.investmentGoal}`;
    }

    // Check for duplicate (same phone or email)
    const existing = await Lead.findOne({
      $or: [{ phone: sanitized.phone }, { email: sanitized.email }],
    });

    if (existing) {
      // Update existing lead
      existing.name = sanitized.name;
      existing.investmentGoal = sanitized.investmentGoal;
      if (finalPriority === 'high') {
        existing.priority = finalPriority;
        existing.priorityReason = finalReason;
      }
      await existing.save();

      // Update user session
      if (sessionId) {
        await User.findOneAndUpdate(
          { sessionId },
          { name: sanitized.name, phone: sanitized.phone, email: sanitized.email, investmentGoal: sanitized.investmentGoal, leadCaptured: true }
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Lead updated successfully.',
        data: { leadId: existing._id },
      });
    }

    // Create new lead
    const lead = await Lead.create({
      sessionId,
      name: sanitized.name,
      phone: sanitized.phone,
      email: sanitized.email,
      investmentGoal: sanitized.investmentGoal,
      priority: finalPriority,
      priorityReason: finalReason,
    });

    // Update user session
    if (sessionId) {
      await User.findOneAndUpdate(
        { sessionId },
        { name: sanitized.name, phone: sanitized.phone, email: sanitized.email, investmentGoal: sanitized.investmentGoal, leadCaptured: true }
      );
    }

    logger.info(`New lead captured: ${lead._id} | Priority: ${finalPriority}`);

    return res.status(201).json({
      success: true,
      message: 'Lead captured successfully.',
      data: { leadId: lead._id },
    });
  } catch (error) {
    logger.error(`Lead creation error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to capture lead.' });
  }
};

/**
 * GET /api/leads  (Admin protected)
 * Get all leads with filters
 */
const getLeads = async (req, res) => {
  try {
    const { priority, status, page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Lead.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    logger.error(`Get leads error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch leads.' });
  }
};

/**
 * PATCH /api/leads/:id  (Admin protected)
 * Update lead status
 */
const updateLead = async (req, res) => {
  try {
    const { status, notes, assignedAdvisor } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes && { notes }), ...(assignedAdvisor && { assignedAdvisor }) },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    logger.error(`Update lead error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to update lead.' });
  }
};

module.exports = { createLead, getLeads, updateLead };
