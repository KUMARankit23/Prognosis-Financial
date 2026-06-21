const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Message = require('../models/Message');
const Lead = require('../models/Lead');
const AdvisorTicket = require('../models/AdvisorTicket');
const logger = require('../utils/logger');

/**
 * POST /api/admin/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return res.status(200).json({
      success: true,
      data: { token, admin: admin.toJSON() },
    });
  } catch (error) {
    logger.error(`Admin login error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

/**
 * GET /api/admin/stats
 * Dashboard statistics
 */
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMessages,
      totalLeads,
      openTickets,
      highPriorityLeads,
      todayLeads,
      intentDistribution,
      leadsByPriority,
    ] = await Promise.all([
      User.countDocuments(),
      Message.countDocuments({ role: 'user' }),
      Lead.countDocuments(),
      AdvisorTicket.countDocuments({ status: 'open' }),
      Lead.countDocuments({ priority: 'high' }),
      Lead.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      Message.aggregate([
        { $match: { role: 'user' } },
        { $group: { _id: '$intent', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalMessages,
        totalLeads,
        openTickets,
        highPriorityLeads,
        todayLeads,
        intentDistribution,
        leadsByPriority,
      },
    });
  } catch (error) {
    logger.error(`Get stats error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};

/**
 * GET /api/admin/advisor-tickets
 */
const getAdvisorTickets = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tickets, total] = await Promise.all([
      AdvisorTicket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      AdvisorTicket.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        tickets,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    logger.error(`Get tickets error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch advisor tickets.' });
  }
};

/**
 * PATCH /api/admin/advisor-tickets/:id
 */
const updateTicket = async (req, res) => {
  try {
    const { status, assignedAdvisor, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (assignedAdvisor) update.assignedAdvisor = assignedAdvisor;
    if (notes) update.notes = notes;
    if (status === 'resolved') update.resolvedAt = new Date();

    const ticket = await AdvisorTicket.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });

    return res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    logger.error(`Update ticket error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to update ticket.' });
  }
};

/**
 * GET /api/admin/users
 */
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find().sort({ lastActive: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: { users, pagination: { total, page: parseInt(page), limit: parseInt(limit) } },
    });
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

module.exports = { login, getStats, getAdvisorTickets, updateTicket, getUsers };
