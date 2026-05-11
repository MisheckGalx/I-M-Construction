/* ============================================================
   models/Enquiry.js — Stores every contact form submission
============================================================ */
const mongoose = require('mongoose');
const { STATUS, SERVICES } = require('../config/constants');

const enquirySchema = new mongoose.Schema(
  {
    /* ── CLIENT INFO ── */
    firstName: {
      type:     String,
      required: [true, 'First name is required'],
      trim:     true,
      maxlength: [60, 'First name too long'],
    },
    lastName: {
      type:     String,
      required: [true, 'Last name is required'],
      trim:     true,
      maxlength: [60, 'Last name too long'],
    },
    email: {
      type:     String,
      required: [true, 'Email is required'],
      trim:     true,
      lowercase: true,
      match:    [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type:    String,
      required:[true, 'Phone number is required'],
      trim:    true,
      maxlength:[30, 'Phone number too long'],
    },

    /* ── PROJECT INFO ── */
    service: {
      type:     String,
      required: [true, 'Service is required'],
      enum:     SERVICES,
    },
    message: {
      type:     String,
      required: [true, 'Project details are required'],
      trim:     true,
      maxlength: [2000, 'Message too long'],
    },

    /* ── ADMIN FIELDS ── */
    status: {
      type:    String,
      enum:    Object.values(STATUS),
      default: STATUS.NEW,
    },
    adminNotes: {
      type:    String,
      trim:    true,
      default: '',
    },
    quotedAmount: {
      type: Number,
      min:  0,
    },

    /* ── META ── */
    ipAddress: String,
    userAgent: String,
    source:    { type: String, default: 'website' },
    emailSent: { type: Boolean, default: false },
    readAt:    Date,
  },
  {
    timestamps: true,   // adds createdAt + updatedAt automatically
  }
);

/* ── VIRTUAL: full name ── */
enquirySchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/* ── INDEX for fast queries ── */
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ email: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
