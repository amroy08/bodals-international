const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

const getBySection = async (req, res) => {
  try {
    const { section } = req.params;
    let query = 'SELECT * FROM section_images WHERE section = ?';
    if (!req.admin) query += ' AND status = "active"';
    query += ' ORDER BY sort_order ASC';
    const [rows] = await db.query(query, [section]);
    return sendSuccess(res, rows);
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM section_images ORDER BY section, sort_order ASC');
    return sendSuccess(res, rows);
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

const create = async (req, res) => {
  try {
    const { section, caption, sort_order, status } = req.body;
    if (!section) return sendError(res, 'Section is required', 400);
    let image = '';
    if (req.file) {
      image = 'section-images/' + req.file.filename;
    } else if (req.body.image_url) {
      image = req.body.image_url;
    } else {
      return sendError(res, 'Image is required', 400);
    }
    const [result] = await db.query(
      'INSERT INTO section_images (section, image, caption, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [section, image, caption || '', sort_order || 0, status || 'active']
    );
    const [row] = await db.query('SELECT * FROM section_images WHERE id = ?', [result.insertId]);
    return sendSuccess(res, row[0], 'Image added', 201);
  } catch (error) {
    console.error('Create section image error:', error);
    return sendError(res, 'Server error');
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, sort_order, status } = req.body;
    const [existing] = await db.query('SELECT * FROM section_images WHERE id = ?', [id]);
    if (existing.length === 0) return sendError(res, 'Image not found', 404);
    let image = existing[0].image;
    if (req.file) {
      if (image && !image.startsWith('http') && fs.existsSync(path.join(__dirname, '../../uploads', image))) {
        fs.unlinkSync(path.join(__dirname, '../../uploads', image));
      }
      image = 'section-images/' + req.file.filename;
    } else if (req.body.image_url) {
      image = req.body.image_url;
    }
    await db.query(
      'UPDATE section_images SET image = ?, caption = ?, sort_order = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [image, caption !== undefined ? caption : existing[0].caption, sort_order !== undefined ? sort_order : existing[0].sort_order, status || existing[0].status, id]
    );
    const [row] = await db.query('SELECT * FROM section_images WHERE id = ?', [id]);
    return sendSuccess(res, row[0], 'Image updated');
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM section_images WHERE id = ?', [id]);
    if (existing.length === 0) return sendError(res, 'Image not found', 404);
    if (existing[0].image && !existing[0].image.startsWith('http')) {
      const imgPath = path.join(__dirname, '../../uploads', existing[0].image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await db.query('DELETE FROM section_images WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Image deleted');
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

module.exports = { getBySection, getAll, create, update, remove };
