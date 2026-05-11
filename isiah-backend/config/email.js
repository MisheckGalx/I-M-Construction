/* ============================================================
   config/email.js — Nodemailer transporter (Gmail SMTP)
============================================================ */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,   // smtp.gmail.com
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: false,                     // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,    // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,       // avoid self-signed cert errors in dev
  },
});

/* ── Verify connection (called once at startup) ── */
const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log('✅  Email transporter ready');
  } catch (err) {
    console.warn(`⚠️   Email transporter error: ${err.message}`);
    console.warn('    Check EMAIL_USER and EMAIL_PASS in your .env file');
  }
};

module.exports = { transporter, verifyMailer };
