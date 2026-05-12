require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seedAdmin() {
  try {
    const email    = process.env.ADMIN_EMAIL    || 'admin@isiah.co.za';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe2025!';
    const name     = process.env.OWNER_NAME     || 'Isiah Mudhluli';

    const existing = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
    if (existing) {
      console.log('✅  Admin already exists:', email);
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 12);
    db.prepare('INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)')
      .run(email, hash, name, 'superadmin');

    console.log('✅  Admin created successfully!');
    console.log('   Email:   ', email);
    console.log('   Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
