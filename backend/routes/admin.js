/* ============================================================
   routes/admin.js — Protected admin dashboard routes
============================================================ */
const express = require('express');
const router  = express.Router();

const {
  login,
  getEnquiries,
  getEnquiry,
  updateStatus,
  deleteEnquiry,
  getStats,
  getMe,
} = require('../controllers/adminController');

const { protect, superAdminOnly }           = require('../middleware/auth');
const { loginRules, updateStatusRules, runValidation } = require('../middleware/validate');
const { authLimiter }                       = require('../middleware/rateLimiter');

/* ── Public ── */
router.post('/login', authLimiter, loginRules, runValidation, login);

/* ── All routes below require valid JWT ── */
router.use(protect);

router.get('/me',    getMe);
router.get('/stats', getStats);

router.get('/',      getEnquiries);           // GET  /api/admin/enquiries
router.get('/:id',   getEnquiry);             // GET  /api/admin/enquiries/:id

router.patch(
  '/:id/status',
  updateStatusRules,
  runValidation,
  updateStatus
);

/* Only superadmin can delete */
router.delete('/:id', superAdminOnly, deleteEnquiry);

module.exports = router;
