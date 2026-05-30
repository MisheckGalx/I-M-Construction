/* ============================================================
   services/emailService.js — Sends owner + client emails
============================================================ */
const { transporter }  = require('../config/email');
const ownerTemplate    = require('../emails/ownerTemplate');
const clientTemplate   = require('../emails/clientTemplate');

/**
 * sendEnquiryEmails
 * Sends two emails in parallel:
 *   1. Owner notification → im@imconstruction.co.za
 *   2. Client auto-reply  → client's email
 *
 * Returns { ownerSent, clientSent } booleans
 */
const sendEnquiryEmails = async (enquiry) => {
  const results = { ownerSent: false, clientSent: false };

  try {
    const [ownerRes, clientRes] = await Promise.allSettled([
      transporter.sendMail(ownerTemplate(enquiry)),
      transporter.sendMail(clientTemplate(enquiry)),
    ]);

    results.ownerSent  = ownerRes.status  === 'fulfilled';
    results.clientSent = clientRes.status === 'fulfilled';

    if (!results.ownerSent) {
      console.error('❌ Owner email failed:', ownerRes.reason?.message);
    }
    if (!results.clientSent) {
      console.error('❌ Client email failed:', clientRes.reason?.message);
    }
    if (results.ownerSent && results.clientSent) {
      console.log(`✅ Both emails sent for enquiry ${enquiry._id}`);
    }
  } catch (err) {
    console.error('❌ Email service error:', err.message);
  }

  return results;
};

module.exports = { sendEnquiryEmails };
