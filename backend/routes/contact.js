/* ============================================================
   routes/contact.js — Public contact form endpoint
============================================================ */
const express   = require('express');
const router    = express.Router();

const { submitContact }             = require('../controllers/contactController');
const { contactRules, runValidation } = require('../middleware/validate');
const { contactLimiter }            = require('../middleware/rateLimiter');

/**
 * POST /api/contact
 * Public — no auth required
 * Rate limited to 5 per 15 min per IP
 */
router.post(
  '/',
  contactLimiter,
  contactRules,
  runValidation,
  submitContact
);

module.exports = router;
