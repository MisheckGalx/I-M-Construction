/* ============================================================
   utils/seedAdmin.js
   Run ONCE to create the first admin account in MongoDB
   Usage: node utils/seedAdmin.js
============================================================ */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Admin    = require('../models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB');

    /* Check if admin already exists */
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) {
      console.log(`⚠️   Admin already exists: ${exists.email}`);
      process.exit(0);
    }

    /* Create admin */
    const admin = await Admin.create({
      name:     process.env.OWNER_NAME     || 'Isiah Mudhluli',
      email:    process.env.ADMIN_EMAIL    || 'Isaiahmudhluli@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'ChangeMe2025!',
      role:     'superadmin',
    });

    console.log('');
    console.log('✅  Admin account created!');
    console.log(`    Email:    ${admin.email}`);
    console.log(`    Password: ${process.env.ADMIN_PASSWORD}`);
    console.log('');
    console.log('⚠️   IMPORTANT: Log in and change your password immediately!');
    console.log('');

  } catch (err) {
    console.error('❌  Seed error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
