const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log('✅  Email transporter ready:', process.env.EMAIL_USER);
  } catch (err) {
    console.log('⚠️   Email transporter error:', err.message);
  }
};

module.exports = { transporter, verifyMailer };
