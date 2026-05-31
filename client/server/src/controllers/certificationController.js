const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

// GET /api/certifications (public)
const getAll = async (req, res) => {
  try {
    let query = 'SELECT * FROM certifications';
    const params = [];

    // Public — only active
    if (!req.admin) {
      query += ' WHERE status = ?';
      params.push('active');
    }
    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    return sendSuccess(res, rows);
  } catch (error) {
    console.error('Get certifications error:', error);
    return sendError(res, 'Server error');
  }
};

// GET /api/certifications/:id
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM certifications WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return sendError(res, 'Certification not found', 404);
    }
    return sendSuccess(res, rows[0]);
  } catch (error) {
    console.error('Get certification error:', error);
    return sendError(res, 'Server error');
  }
};

// POST /api/certifications (admin)
const create = async (req, res) => {
  try {
    const { name, full_name, description, status } = req.body;

    if (!name) {
      return sendError(res, 'Name is required', 400);
    }

    const document = req.file ? 'certifications/' + req.file.filename : null;

    const [result] = await db.query(
      `INSERT INTO certifications (name, full_name, description, document, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, full_name || '', description || '', document, status || 'active']
    );

    const [newCert] = await db.query('SELECT * FROM certifications WHERE id = ?', [result.insertId]);
    return sendSuccess(res, newCert[0], 'Certification created', 201);
  } catch (error) {
    console.error('Create certification error:', error);
    return sendError(res, 'Server error');
  }
};

// PUT /api/certifications/:id (admin)
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, full_name, description, status } = req.body;

    const [existing] = await db.query('SELECT * FROM certifications WHERE id = ?', [id]);
    if (existing.length === 0) {
      return sendError(res, 'Certification not found', 404);
    }

    let document = existing[0].document;
    if (req.file) {
      if (document) {
        const oldPath = path.join(__dirname, '../../uploads', document);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      document = 'certifications/' + req.file.filename;
    }

    await db.query(
      `UPDATE certifications SET name = ?, full_name = ?, description = ?,
       document = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [
        name || existing[0].name,
        full_name !== undefined ? full_name : existing[0].full_name,
        description !== undefined ? description : existing[0].description,
        document,
        status || existing[0].status,
        id
      ]
    );

    const [updated] = await db.query('SELECT * FROM certifications WHERE id = ?', [id]);
    return sendSuccess(res, updated[0], 'Certification updated');
  } catch (error) {
    console.error('Update certification error:', error);
    return sendError(res, 'Server error');
  }
};

// DELETE /api/certifications/:id (admin)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM certifications WHERE id = ?', [id]);
    if (existing.length === 0) {
      return sendError(res, 'Certification not found', 404);
    }

    if (existing[0].document) {
      const docPath = path.join(__dirname, '../../uploads', existing[0].document);
      if (fs.existsSync(docPath)) fs.unlinkSync(docPath);
    }

    await db.query('DELETE FROM certifications WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Certification deleted');
  } catch (error) {
    console.error('Delete certification error:', error);
    return sendError(res, 'Server error');
  }
};

module.exports = { getAll, getById, create, update, remove };
