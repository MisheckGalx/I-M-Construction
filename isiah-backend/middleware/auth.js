const jwt  = require('jsonwebtoken');
const db   = require('../config/db');
const { AppError } = require('./errorHandler');

const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return next(new AppError('Not authenticated', 401));
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = db.prepare('SELECT id, name, email, role FROM admins WHERE id = ?').get(decoded.id);
    if (!admin) return next(new AppError('Admin no longer exists', 401));
    req.admin = admin;
    next();
  } catch (err) {
    next(new AppError('Invalid token', 401));
  }
};

module.exports = { protect };
