const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');
const {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} = require('../controllers/projectsController');

// Cloudinary config — reads from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer → Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'im-construction/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Images only (jpg, png, webp)'));
  },
});

// Public
router.get('/', getProjects);

// Protected
router.post('/',        protect, upload.single('image'), createProject);
router.patch('/:id',   protect, updateProject);
router.delete('/:id',  protect, deleteProject);

module.exports = router;
