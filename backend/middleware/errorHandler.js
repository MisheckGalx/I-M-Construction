/* ============================================================
   middleware/errorHandler.js — Global error handler
============================================================ */

/* Custom error class so we can attach a status code */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status     = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;   // tells handler this is a known, safe error
    Error.captureStackTrace(this, this.constructor);
  }
}

/* ── Global error middleware (must have 4 params) ── */
const errorHandler = (err, req, res, next) => {  // eslint-disable-line no-unused-vars
  err.statusCode = err.statusCode || 500;
  err.status     = err.status     || 'error';

  /* ── Dev: full details ── */
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status:  err.status,
      message: err.message,
      stack:   err.stack,
      error:   err,
    });
  }

  /* ── Mongoose: duplicate key (e.g. unique email) ── */
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ status: 'fail', message: `${field} already exists.` });
  }

  /* ── Mongoose: validation error ── */
  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ status: 'fail', message: msgs.join('. ') });
  }

  /* ── JWT errors ── */
  if (err.name === 'JsonWebTokenError')  return res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in again.' });
  if (err.name === 'TokenExpiredError')  return res.status(401).json({ status: 'fail', message: 'Session expired. Please log in again.' });

  /* ── Production: operational errors are safe to show ── */
  if (err.isOperational) {
    return res.status(err.statusCode).json({ status: err.status, message: err.message });
  }

  /* ── Unknown errors: hide details in production ── */
  console.error('💥 UNEXPECTED ERROR:', err);
  return res.status(500).json({ status: 'error', message: 'Something went wrong. Please try again.' });
};

module.exports = { AppError, errorHandler };
