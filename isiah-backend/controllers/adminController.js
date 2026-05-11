/* ============================================================
   controllers/adminController.js
   All admin dashboard operations — login, enquiries, stats
============================================================ */
const jwt      = require('jsonwebtoken');
const Admin    = require('../models/Admin');
const Enquiry  = require('../models/Enquiry');
const { AppError } = require('../middleware/errorHandler');
const { STATUS, DEFAULT_PAGE, DEFAULT_LIMIT } = require('../config/constants');

/* ── Generate JWT ── */
const _signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/* ── POST /api/admin/login ── */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    /* Find admin + include password (select:false by default) */
    const admin = await Admin.findOne({ email, active: true }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    /* Update last login */
    admin.lastLogin = Date.now();
    await admin.save({ validateBeforeSave: false });

    const token = _signToken(admin._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/admin/enquiries ── */
const getEnquiries = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)   || DEFAULT_PAGE;
    const limit  = parseInt(req.query.limit)  || DEFAULT_LIMIT;
    const status = req.query.status;
    const search = req.query.search;

    /* Build filter */
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } },
        { phone:     { $regex: search, $options: 'i' } },
        { service:   { $regex: search, $options: 'i' } },
      ];
    }

    const total     = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: 'success',
      results: enquiries.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: { enquiries },
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/admin/enquiries/:id ── */
const getEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return next(new AppError('Enquiry not found', 404));

    /* Mark as read */
    if (!enquiry.readAt) {
      enquiry.readAt = new Date();
      await enquiry.save({ validateBeforeSave: false });
    }

    res.status(200).json({ status: 'success', data: { enquiry } });
  } catch (err) {
    next(err);
  }
};

/* ── PATCH /api/admin/enquiries/:id/status ── */
const updateStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, quotedAmount } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, ...(adminNotes    !== undefined && { adminNotes }),
                ...(quotedAmount  !== undefined && { quotedAmount }) },
      { new: true, runValidators: true }
    );
    if (!enquiry) return next(new AppError('Enquiry not found', 404));

    res.status(200).json({ status: 'success', data: { enquiry } });
  } catch (err) {
    next(err);
  }
};

/* ── DELETE /api/admin/enquiries/:id ── */
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return next(new AppError('Enquiry not found', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/admin/stats ── */
const getStats = async (req, res, next) => {
  try {
    const [
      total,
      newCount,
      contacted,
      quoted,
      accepted,
      completed,
      declined,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: STATUS.NEW }),
      Enquiry.countDocuments({ status: STATUS.CONTACTED }),
      Enquiry.countDocuments({ status: STATUS.QUOTED }),
      Enquiry.countDocuments({ status: STATUS.ACCEPTED }),
      Enquiry.countDocuments({ status: STATUS.COMPLETED }),
      Enquiry.countDocuments({ status: STATUS.DECLINED }),
    ]);

    /* Enquiries by service */
    const byService = await Enquiry.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
    ]);

    /* Last 7 days daily counts */
    const last7Days = await Enquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totals: { total, new: newCount, contacted, quoted, accepted, completed, declined },
        byService,
        last7Days,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/admin/me ── */
const getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      admin: {
        id:        req.admin._id,
        name:      req.admin.name,
        email:     req.admin.email,
        role:      req.admin.role,
        lastLogin: req.admin.lastLogin,
      },
    },
  });
};

module.exports = {
  login,
  getEnquiries,
  getEnquiry,
  updateStatus,
  deleteEnquiry,
  getStats,
  getMe,
};
