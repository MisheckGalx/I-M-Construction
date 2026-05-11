/* ============================================================
   middleware/rateLimiter.js — Prevent spam & brute-force
============================================================ */
const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config/constants');

/* ── Contact form: max 5 submissions per 15 min per IP ── */
const contactLimiter = rateLimit({
  windowMs: RATE_LIMIT.CONTACT_WINDOW_MS,
  max:      RATE_LIMIT.CONTACT_MAX,
  message: {
    status:  'fail',
    message: 'Too many submissions from this IP. Please wait 15 minutes and try again.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
  skipSuccessfulRequests: false,
});

/* ── General API limiter: 100 requests per 15 min ── */
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.API_WINDOW_MS,
  max:      RATE_LIMIT.API_MAX,
  message: {
    status:  'fail',
    message: 'Too many requests from this IP. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

/* ── Auth limiter: 10 login attempts per 15 min ── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message: {
    status:  'fail',
    message: 'Too many login attempts. Please wait 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { contactLimiter, apiLimiter, authLimiter };
