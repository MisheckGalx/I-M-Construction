const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db     = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

const _signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/* ── POST /api/admin/login ── */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    db.prepare("UPDATE admins SET lastLogin = datetime('now') WHERE id = ?").run(admin.id);
    const token = _signToken(admin.id);
    res.status(200).json({
      status: 'success',
      token,
      data: { admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } },
    });
  } catch (err) { next(err); }
};

/* ── GET /api/admin/enquiries ── */
const getEnquiries = (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search ? `%${req.query.search}%` : null;
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params = [];
    if (status && status !== 'all') { where += ' AND status = ?'; params.push(status); }
    if (search) {
      where += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR service LIKE ?)';
      params.push(search, search, search, search);
    }

    const total     = db.prepare(`SELECT COUNT(*) as c FROM enquiries ${where}`).get(...params).c;
    const enquiries = db.prepare(`SELECT * FROM enquiries ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
                        .all(...params, limit, offset);

    res.status(200).json({
      status: 'success',
      results: enquiries.length,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      data: { enquiries },
    });
  } catch (err) { next(err); }
};

/* ── GET /api/admin/enquiries/:id ── */
const getEnquiry = (req, res, next) => {
  try {
    const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
    if (!enquiry) return next(new AppError('Enquiry not found', 404));
    res.status(200).json({ status: 'success', data: { enquiry } });
  } catch (err) { next(err); }
};

/* ── PATCH /api/admin/enquiries/:id/status ── */
const updateStatus = (req, res, next) => {
  try {
    const { status, adminNotes, quotedAmount } = req.body;
    db.prepare('UPDATE enquiries SET status=?, adminNotes=?, quotedAmount=? WHERE id=?')
      .run(status, adminNotes || '', quotedAmount || null, req.params.id);
    const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
    if (!enquiry) return next(new AppError('Enquiry not found', 404));
    res.status(200).json({ status: 'success', data: { enquiry } });
  } catch (err) { next(err); }
};

/* ── DELETE /api/admin/enquiries/:id ── */
const deleteEnquiry = (req, res, next) => {
  try {
    const result = db.prepare('DELETE FROM enquiries WHERE id = ?').run(req.params.id);
    if (!result.changes) return next(new AppError('Enquiry not found', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};

/* ── GET /api/admin/stats ── */
const getStats = (req, res, next) => {
  try {
    const total     = db.prepare("SELECT COUNT(*) as c FROM enquiries").get().c;
    const newCount  = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status='new'").get().c;
    const contacted = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status='contacted'").get().c;
    const quoted    = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status='quoted'").get().c;
    const accepted  = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status='accepted'").get().c;
    const completed = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status='completed'").get().c;
    const declined  = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status='declined'").get().c;
    const byService = db.prepare("SELECT service as _id, COUNT(*) as count FROM enquiries GROUP BY service ORDER BY count DESC").all();
    const last7Days = db.prepare("SELECT date(createdAt) as _id, COUNT(*) as count FROM enquiries WHERE createdAt >= datetime('now','-7 days') GROUP BY date(createdAt) ORDER BY _id ASC").all();

    res.status(200).json({
      status: 'success',
      data: {
        totals: { total, new: newCount, contacted, quoted, accepted, completed, declined },
        byService,
        last7Days,
      },
    });
  } catch (err) { next(err); }
};

/* ── GET /api/admin/me ── */
const getMe = (req, res) => {
  res.status(200).json({ status: 'success', data: { admin: req.admin } });
};

module.exports = { login, getEnquiries, getEnquiry, updateStatus, deleteEnquiry, getStats, getMe };
