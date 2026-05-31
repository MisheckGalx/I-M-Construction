const db   = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const cloudinary = require('cloudinary').v2;

/* ── GET /api/projects — public ── */
const getProjects = (req, res, next) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY sortOrder ASC, createdAt DESC').all();
    res.status(200).json({ status: 'success', data: { projects } });
  } catch(err) { next(err); }
};

/* ── POST /api/projects — admin only ── */
const createProject = (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    if (!req.file) return next(new AppError('Image is required', 400));
    if (!title)    return next(new AppError('Title is required', 400));
    if (!category) return next(new AppError('Category is required', 400));

    // Cloudinary returns the full URL in req.file.path
    const image = req.file.path;

    const result = db.prepare(
      'INSERT INTO projects (title, category, description, image) VALUES (?, ?, ?, ?)'
    ).run(title, category, description || '', image);

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ status: 'success', data: { project } });
  } catch(err) { next(err); }
};

/* ── DELETE /api/projects/:id — admin only ── */
const deleteProject = (req, res, next) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    // Delete from Cloudinary if it's a Cloudinary URL
    if (project.image && project.image.includes('cloudinary.com')) {
      // Extract public_id from URL e.g. im-construction/projects/abc123
      const parts = project.image.split('/');
      const filename = parts[parts.length - 1].split('.')[0];
      const folder   = parts[parts.length - 2];
      const parentFolder = parts[parts.length - 3];
      const publicId = `${parentFolder}/${folder}/${filename}`;
      cloudinary.uploader.destroy(publicId).catch(err =>
        console.warn('Cloudinary delete warning:', err.message)
      );
    }

    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch(err) { next(err); }
};

/* ── PATCH /api/projects/:id — admin only ── */
const updateProject = (req, res, next) => {
  try {
    const { title, category, description, featured, sortOrder } = req.body;
    db.prepare(
      'UPDATE projects SET title=?, category=?, description=?, featured=?, sortOrder=? WHERE id=?'
    ).run(title, category, description || '', featured ?? 1, sortOrder ?? 0, req.params.id);
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));
    res.status(200).json({ status: 'success', data: { project } });
  } catch(err) { next(err); }
};

module.exports = { getProjects, createProject, deleteProject, updateProject };

/* ── GET /api/projects — public ── */
const getProjects = (req, res, next) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY sortOrder ASC, createdAt DESC').all();
    res.status(200).json({ status: 'success', data: { projects } });
  } catch(err) { next(err); }
};

/* ── POST /api/projects — admin only ── */
const createProject = (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    if (!req.file) return next(new AppError('Image is required', 400));
    if (!title)    return next(new AppError('Title is required', 400));
    if (!category) return next(new AppError('Category is required', 400));

    const image = `/uploads/${req.file.filename}`;
    const result = db.prepare(
      'INSERT INTO projects (title, category, description, image) VALUES (?, ?, ?, ?)'
    ).run(title, category, description || '', image);

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ status: 'success', data: { project } });
  } catch(err) { next(err); }
};

/* ── DELETE /api/projects/:id — admin only ── */
const deleteProject = (req, res, next) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    // Delete image file from disk
    const imgPath = path.join(__dirname, '../public', project.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch(err) { next(err); }
};

/* ── PATCH /api/projects/:id — admin only ── */
const updateProject = (req, res, next) => {
  try {
    const { title, category, description, featured, sortOrder } = req.body;
    db.prepare(
      'UPDATE projects SET title=?, category=?, description=?, featured=?, sortOrder=? WHERE id=?'
    ).run(title, category, description || '', featured ?? 1, sortOrder ?? 0, req.params.id);
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));
    res.status(200).json({ status: 'success', data: { project } });
  } catch(err) { next(err); }
};

module.exports = { getProjects, createProject, deleteProject, updateProject };
