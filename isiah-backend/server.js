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
app.use(cors({ origin: ['https://imconstruction.co.za', 'https://www.imconstruction.co.za', 'https://im-construction.netlify.app', 'http://localhost:3000', 'http://127.0.0.1:5000'], methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());
app.use('/uploads', require('express').static(require('path').join(__dirname, 'public/uploads')));
app.use(morgan('dev'));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/projects', require('./routes/projects'));
app.use('/api/admin',   adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'sqlite', uptime: process.uptime() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅  Server listening on http://localhost:${PORT}`);
});

// Auto-seed admin on first run
if (process.env.SEED_ADMIN === 'true') {
  const bcrypt = require('bcryptjs');
  const db = require('./config/db');
  setTimeout(async () => {
    try {
      const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(process.env.ADMIN_EMAIL);
      if (!existing) {
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        db.prepare('INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)')
          .run(process.env.ADMIN_EMAIL, hash, process.env.OWNER_NAME || 'Admin', 'superadmin');
        console.log('✅  Admin seeded:', process.env.ADMIN_EMAIL);
      } else {
        console.log('✅  Admin already exists');
      }
    } catch(e) { console.error('Seed error:', e.message); }
  }, 2000);
}
