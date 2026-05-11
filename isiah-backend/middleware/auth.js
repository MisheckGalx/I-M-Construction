/* ============================================================
   middleware/auth.js — Protect admin routes with JWT
============================================================ */
const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { AppError } = require('./errorHandler');

const protect = async (req, res, next) => {
  try {
    /* ── 1. Get token from header ── */
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('Not authenticated. Please log in.', 401));

    /* ── 2. Verify token ── */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ── 3. Check admin still exists + is active ── */
    const admin = await Admin.findById(decoded.id).select('+password');
    if (!admin || !admin.active) {
      return next(new AppError('This account no longer exists or has been deactivated.', 401));
    }

    /* ── 4. Attach admin to request ── */
    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

/* ── Restrict to superadmin only ── */
const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};

module.exports = { protect, superAdminOnly };
