/* ============================================================
   models/Admin.js — Admin user (dashboard login)
============================================================ */
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:     String,
      required: true,
      minlength: 8,
      select:   false,   // never return password in queries
    },
    role: {
      type:    String,
      enum:    ['admin', 'superadmin'],
      default: 'admin',
    },
    lastLogin: Date,
    active: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ── Hash password before saving ── */
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ── Compare entered password to hashed password ── */
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
