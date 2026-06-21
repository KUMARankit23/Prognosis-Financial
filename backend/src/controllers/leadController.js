const Lead = require('../models/Lead');
const User = require('../models/User');
const { sanitizeLeadData, validatePhone, validateEmail } = require('../utils/sanitizer');
const { scorePriority, calculateEngagementScore } = require('../services/intentClassifier');
const logger = require('../utils/logger');

/**
 * POST /api/leads
 * Capture a new lead — CIP Extended Profile
 */
const createLead = async (req, res) => {
  try {
    const {
      sessionId, name, phone, email, investmentGoal, context,
      riskProfile, productInterest, investmentHorizon,
    } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Name, phone, and email are required.' });
    }

    const sanitized = sanitizeLeadData({ name, phone, email, investmentGoal });

    if (!validatePhone(sanitized.phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit Indian mobile number.' });
    }
    if (!validateEmail(sanitized.email)) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
    }

    // CIP Priority scoring
    const contextText = `${investmentGoal || ''} ${context || ''}`;
    const { priority, priorityReason } = scorePriority(contextText);

    let finalPriority = priority;
    let finalReason = priorityReason;

    // CIP HIGH priority: retirement, wealth_creation, large investment amounts
    if (['retirement', 'wealth_creation'].includes(sanitized.investmentGoal)) {
      finalPriority = 'high';
      finalReason = `High-value goal: ${sanitized.investmentGoal}`;
    }

    // Check duplicate
    const existing = await Lead.findOne({
      $or: [{ phone: sanitized.phone }, { email: sanitized.email }],
    });

    if (existing) {
      existing.name = sanitized.name;
      existing.investmentGoal = sanitized.investmentGoal;
      if (riskProfile) existing.riskProfile = riskProfile;
      if (productInterest) existing.productInterest = productInterest;
      if (investmentHorizon) existing.investmentHorizon = investmentHorizon;
      if (finalPriority === 'high') {
        existing.priority = finalPriority;
        existing.priorityReason = finalReason;
      }
      existing.lastActive = new Date();
      existing.totalConversations = (existing.totalConversations || 1) + 1;
      existing.engagementScore = calculateEngagementScore({
        totalMessages: existing.totalConversations * 3,
        priority: existing.priority,
      });
      await existing.save();

      if (sessionId) {
        await User.findOneAndUpdate({ sessionId }, {
          name: sanitized.name, phone: sanitized.phone,
          email: sanitized.email, investmentGoal: sanitized.investmentGoal, leadCaptured: true,
        });
      }

      return res.status(200).json({ success: true, message: 'Lead updated.', data: { leadId: existing._id } });
    }

    const engagementScore = calculateEngagementScore({ totalMessages: 3, priority: finalPriority });

    const lead = await Lead.create({
      sessionId,
      name: sanitized.name,
      phone: sanitized.phone,
      email: sanitized.email,
      investmentGoal: sanitized.investmentGoal,
      riskProfile: riskProfile || 'not_specified',
      productInterest: productInterest || [],
      investmentHorizon: investmentHorizon || 'not_specified',
      priority: finalPriority,
      priorityReason: finalReason,
      engagementScore,
    });

    if (sessionId) {
      await User.findOneAndUpdate({ sessionId }, {
        name: sanitized.name, phone: sanitized.phone,
        email: sanitized.email, investmentGoal: sanitized.investmentGoal, leadCaptured: true,
      });
    }

    logger.info(`Lead captured: ${lead._id} | Priority: ${finalPriority}`);
    return res.status(201).json({ success: true, message: 'Lead captured.', data: { leadId: lead._id } });
  } catch (error) {
    logger.error(`Lead creation error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to capture lead.' });
  }
};

/**
 * GET /api/leads (Admin)
 */
const getLeads = async (req, res) => {
  try {
    const { priority, status, followUpStatus, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (followUpStatus) filter.followUpStatus = followUpStatus;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ priority: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Lead.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: { leads, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } },
    });
  } catch (error) {
    logger.error(`Get leads error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch leads.' });
  }
};

/**
 * PATCH /api/leads/:id (Admin)
 */
const updateLead = async (req, res) => {
  try {
    const { status, notes, followUpStatus, followUpDate, followUpNotes, riskProfile, investmentHorizon } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (followUpStatus) update.followUpStatus = followUpStatus;
    if (followUpDate) update.followUpDate = new Date(followUpDate);
    if (followUpNotes) update.followUpNotes = followUpNotes;
    if (riskProfile) update.riskProfile = riskProfile;
    if (investmentHorizon) update.investmentHorizon = investmentHorizon;

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });

    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    logger.error(`Update lead error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to update lead.' });
  }
};

module.exports = { createLead, getLeads, updateLead };
