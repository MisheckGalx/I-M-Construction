const db = require('../config/db');
const { sendEnquiryEmails } = require('../services/emailService');

const submitContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, service, message } = req.body;

    const result = db.prepare(`
      INSERT INTO enquiries (firstName, lastName, email, phone, service, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(firstName, lastName, email, phone, service, message);

    const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(result.lastInsertRowid);

    // Send emails (won't crash if email is disabled)
    try { await sendEnquiryEmails(enquiry); } catch (_) {}

    res.status(201).json({
      status:  'success',
      message: "Your enquiry has been received. We'll be in touch within 24 hours.",
      data:    { id: enquiry.id },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact };
