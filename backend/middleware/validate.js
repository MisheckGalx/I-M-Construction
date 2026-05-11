/* ============================================================
   middleware/validate.js — Input validation rules
============================================================ */
const { body, param, validationResult } = require('express-validator');
const { SERVICES } = require('../config/constants');

/* ── Run validation and return errors ── */
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status:  'fail',
      message: errors.array()[0].msg,
      errors:  errors.array(),
    });
  }
  next();
};

/* ── Contact form rules ── */
const contactRules = [
  body('firstName')
    .trim().notEmpty().withMessage('First name is required')
    .isLength({ max: 60 }).withMessage('First name too long'),

  body('lastName')
    .trim().notEmpty().withMessage('Last name is required')
    .isLength({ max: 60 }).withMessage('Last name too long'),

  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim().notEmpty().withMessage('Phone number is required')
    .isLength({ min: 7, max: 30 }).withMessage('Please enter a valid phone number'),

  body('service')
    .trim().notEmpty().withMessage('Please select a service')
    .isIn(SERVICES).withMessage('Invalid service selected'),

  body('message')
    .trim().notEmpty().withMessage('Please describe your project')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
];

/* ── Admin login rules ── */
const loginRules = [
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email').normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

/* ── Update enquiry status rules ── */
const updateStatusRules = [
  param('id').isMongoId().withMessage('Invalid enquiry ID'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['new','contacted','quoted','accepted','declined','completed'])
    .withMessage('Invalid status value'),
];

module.exports = {
  runValidation,
  contactRules,
  loginRules,
  updateStatusRules,
};
