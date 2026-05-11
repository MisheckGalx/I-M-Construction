/* ============================================================
   config/db.js — MongoDB connection via Mongoose
============================================================ */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8 uses these by default — listed for clarity
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS:          45000,
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

    // Graceful disconnect on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌  MongoDB disconnected on app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error(`❌  MongoDB connection error: ${err.message}`);
    process.exit(1);   // Exit with failure — let host restart the process
  }
};

module.exports = connectDB;
