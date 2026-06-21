const FollowUp = require('../models/FollowUp');
const Lead = require('../models/Lead');
const logger = require('../utils/logger');

/**
 * POST /api/followups — Create follow-up request
 * BUG-02 fix: leadId is now optional — anonymous users without a lead can still request follow-ups.
 * The controller resolves lead data from leadId or sessionId when available, but does not require it.
 */
const createFollowUp = async (req, res) => {
  try {
    const { leadId, sessionId, reason, channel, scheduledAt } = req.body;
    if (!leadId && !sessionId) {
      return res.status(400).json({ success: false, message: 'leadId or sessionId required.' });
    }

    // Attempt to find an associated lead — gracefully handles null (anonymous users)
    let lead = null;
    try {
      if (leadId) {
        lead = await Lead.findById(leadId);
      } else if (sessionId) {
        lead = await Lead.findOne({ sessionId });
      }
    } catch (lookupErr) {
      // Non-fatal — proceed without a lead reference
      logger.warn(`FollowUp lead lookup failed: ${lookupErr.message}`);
    }

    const followUp = await FollowUp.create({
      // BUG-02 fix: leadId is optional — omit field entirely if lead not found
      ...(lead?._id ? { leadId: lead._id } : {}),
      sessionId: sessionId || lead?.sessionId || 'unknown',
      userName: lead?.name || 'Anonymous',
      userPhone: lead?.phone || '',
      userEmail: lead?.email || '',
      reason: reason || 'Customer requested follow-up via chatbot',
      channel: channel || 'call',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: scheduledAt ? 'scheduled' : 'pending',
    });

    // Update lead follow-up tracking only when a lead is linked
    if (lead) {
      lead.followUpStatus = followUp.status;
      lead.followUpCount = (lead.followUpCount || 0) + 1;
      lead.followUpDate = followUp.scheduledAt;
      await lead.save();
    }

    logger.info(`Follow-up created: ${followUp._id} for session: ${sessionId}`);
    return res.status(201).json({ success: true, data: followUp });
  } catch (error) {
    logger.error(`Create follow-up error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to create follow-up.' });
  }
};

/**
 * GET /api/followups — Get all follow-ups (admin)
 */
const getFollowUps = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [followUps, total] = await Promise.all([
      FollowUp.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      FollowUp.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: { followUps, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) } },
    });
  } catch (error) {
    logger.error(`Get follow-ups error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch follow-ups.' });
  }
};

/**
 * PATCH /api/followups/:id — Update follow-up status
 */
const updateFollowUp = async (req, res) => {
  try {
    const { status, notes, outcome, assignedTo, scheduledAt } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes) update.notes = notes;
    if (outcome) update.outcome = outcome;
    if (assignedTo) update.assignedTo = assignedTo;
    if (scheduledAt) update.scheduledAt = new Date(scheduledAt);
    if (status === 'completed') update.completedAt = new Date();

    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!followUp) return res.status(404).json({ success: false, message: 'Follow-up not found.' });

    // Sync lead follow-up status
    if (followUp.leadId) {
      await Lead.findByIdAndUpdate(followUp.leadId, { followUpStatus: followUp.status });
    }

    return res.status(200).json({ success: true, data: followUp });
  } catch (error) {
    logger.error(`Update follow-up error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to update follow-up.' });
  }
};

module.exports = { createFollowUp, getFollowUps, updateFollowUp };
