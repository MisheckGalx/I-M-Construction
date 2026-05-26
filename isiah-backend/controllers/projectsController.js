const db   = require('../config/db');
const path = require('path');
const fs   = require('fs');
const { AppError } = require('../middleware/errorHandler');

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
