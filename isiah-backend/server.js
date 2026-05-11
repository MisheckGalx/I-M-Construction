/* ============================================================
   server.js — I&M Construction Company Backend
   Entry point — starts Express server
============================================================ */
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const compression  = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB          = require('./config/db');
const { verifyMailer }   = require('./config/email');
const { errorHandler }   = require('./middleware/errorHandler');
const { apiLimiter }     = require('./middleware/rateLimiter');

/* ── Route files ── */
const contactRoutes = require('./routes/contact');
const adminRoutes   = require('./routes/admin');

/* ── Connect to MongoDB ── */
connectDB();

const app = express();

/* ════════════════════════════════════════
   SECURITY MIDDLEWARE
════════════════════════════════════════ */

/* Set security HTTP headers */
app.use(helmet());

/* CORS — allow your frontend domain */
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:5500',   // VS Code Live Server
      'http://localhost:5500',
    ].filter(Boolean);

    /* Allow requests with no origin (Postman, mobile apps) */
    if (!origin || allowed.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: ${origin} not allowed`));
  },
  methods:     ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

/* ════════════════════════════════════════
   GENERAL MIDDLEWARE
════════════════════════════════════════ */
app.use(compression());                              // gzip responses
app.use(express.json({ limit: '10kb' }));            // parse JSON body (max 10kb)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());                            // strip $ and . from input

/* Logging */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/* Global API rate limit */
app.use('/api', apiLimiter);

/* Trust proxy (needed for rate limiting behind Nginx/Railway/Render) */
app.set('trust proxy', 1);

/* ════════════════════════════════════════
   ROUTES
════════════════════════════════════════ */
app.use('/api/contact',          contactRoutes);
app.use('/api/admin/enquiries',  adminRoutes);
app.use('/api/admin',            adminRoutes);

/* ── Health check (used by hosting platforms) ── */
app.get('/health', (req, res) => {
  res.status(200).json({
    status:  'ok',
    service: 'I&M Construction API',
    time:    new Date().toISOString(),
    env:     process.env.NODE_ENV,
  });
});

/* ── 404 handler ── */
app.all('*', (req, res) => {
  res.status(404).json({
    status:  'fail',
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ── Global error handler (must be last) ── */
app.use(errorHandler);

/* ════════════════════════════════════════
   START SERVER
════════════════════════════════════════ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log('');
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   I&M Construction — API Server       ║');
  console.log(`║   Running on port ${PORT}                 ║`);
  console.log(`║   Mode: ${(process.env.NODE_ENV || 'development').padEnd(29)} ║`);
  console.log('╚═══════════════════════════════════════╝');
  console.log('');

  await verifyMailer();
});

module.exports = app;
