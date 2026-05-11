/* ============================================================
   utils/testEmail.js
   Test your Gmail SMTP setup before going live
   Usage: node utils/testEmail.js
============================================================ */
require('dotenv').config({ path: '../.env' });
const { transporter } = require('../config/email');
const { COMPANY }     = require('../config/constants');

const testEnquiry = {
  _id:       'TEST-001',
  firstName: 'Test',
  lastName:  'Client',
  email:     process.env.OWNER_EMAIL,
  phone:     '061 000 0000',
  service:   'Paving Services',
  message:   'This is a test submission from utils/testEmail.js to verify the email setup is working correctly.',
  ipAddress: '127.0.0.1',
  createdAt: new Date(),
};

(async () => {
  console.log('');
  console.log('📧  Testing email configuration...');
  console.log(`    Sending FROM: ${process.env.EMAIL_USER}`);
  console.log(`    Sending TO:   ${process.env.OWNER_EMAIL}`);
  console.log('');

  try {
    await transporter.verify();
    console.log('✅  SMTP connection verified');

    const ownerTemplate  = require('../emails/ownerTemplate');
    const clientTemplate = require('../emails/clientTemplate');

    const [owner, client] = await Promise.allSettled([
      transporter.sendMail(ownerTemplate(testEnquiry)),
      transporter.sendMail(clientTemplate(testEnquiry)),
    ]);

    console.log('');
    console.log('Owner notification:', owner.status  === 'fulfilled' ? '✅  Sent' : `❌  Failed: ${owner.reason?.message}`);
    console.log('Client auto-reply: ', client.status === 'fulfilled' ? '✅  Sent' : `❌  Failed: ${client.reason?.message}`);
    console.log('');
    console.log('📬  Check your inbox at:', process.env.OWNER_EMAIL);
    console.log('');

  } catch (err) {
    console.error('❌  SMTP Error:', err.message);
    console.error('');
    console.error('Common fixes:');
    console.error('  • Make sure EMAIL_USER and EMAIL_PASS are set in .env');
    console.error('  • Use a Gmail App Password, not your real Gmail password');
    console.error('  • Enable 2FA on your Google account first');
    console.error('  • Go to: myaccount.google.com → Security → App passwords');
  }

  process.exit(0);
})();
