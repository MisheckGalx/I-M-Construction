/* ============================================================
   controllers/contactController.js
   POST /api/contact — saves enquiry + sends emails
============================================================ */
const Enquiry            = require('../models/Enquiry');
const { sendEnquiryEmails } = require('../services/emailService');
const { AppError }       = require('../middleware/errorHandler');

/* ── POST /api/contact ── */
const submitContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, service, message } = req.body;

    /* ── 1. Save to MongoDB ── */
    const enquiry = await Enquiry.create({
      firstName,
      lastName,
      email,
      phone,
      service,
      message,
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
      source:    'website',
    });

    /* ── 2. Send emails (non-blocking — don't fail the request if email fails) ── */
    const { ownerSent, clientSent } = await sendEnquiryEmails(enquiry);

    /* ── 3. Update emailSent flag ── */
    if (ownerSent) {
      await Enquiry.findByIdAndUpdate(enquiry._id, { emailSent: true });
    }

    /* ── 4. Respond to client ── */
    res.status(201).json({
      status:  'success',
      message: 'Your enquiry has been received. We\'ll be in touch within 24 hours.',
      data: {
        id:          enquiry._id,
        emailSent:   ownerSent,
        confirmSent: clientSent,
      },
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact };
