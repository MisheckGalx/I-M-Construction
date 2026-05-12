const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  login,
  getEnquiries,
  getEnquiry,
  updateStatus,
  deleteEnquiry,
  getStats,
  getMe,
} = require('../controllers/adminController');

// Public
router.post('/login', login);

// Protected — all routes below require JWT
router.use(protect);

router.get('/me',          getMe);
router.get('/stats',       getStats);
router.get('/enquiries',   getEnquiries);
router.get('/enquiries/:id',          getEnquiry);
router.patch('/enquiries/:id/status', updateStatus);
router.delete('/enquiries/:id',       deleteEnquiry);

module.exports = router;
