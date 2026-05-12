require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const { verifyMailer } = require('./config/email');
const db         = require('./config/db');
const contactRoutes = require('./routes/contact');
const adminRoutes   = require('./routes/admin');
const { errorHandler } = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

console.log(`
╔═══════════════════════════════════════╗
║   I&M Construction — API Server       ║
║   Running on port ${PORT}                 ║
║   Mode: ${process.env.NODE_ENV}                   ║
╚═══════════════════════════════════════╝
`);

verifyMailer();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/admin',   adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'sqlite', uptime: process.uptime() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅  Server listening on http://localhost:${PORT}`);
});
