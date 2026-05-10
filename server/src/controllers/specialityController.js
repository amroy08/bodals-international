const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    let query = 'SELECT * FROM specialities';
    if (!req.admin) query += ' WHERE status = "active"';
    query += ' ORDER BY sort_order ASC, created_at DESC';
    const [rows] = await db.query(query);
    return sendSuccess(res, rows);
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

const create = async (req, res) => {
  try {
    const { title, description, icon, sort_order, status } = req.body;
    if (!title) return sendError(res, 'Title is required', 400);
    const [result] = await db.query(
      'INSERT INTO specialities (title, description, icon, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [title, description || '', icon || 'Sprout', sort_order || 0, status || 'active']
    );
    const [row] = await db.query('SELECT * FROM specialities WHERE id = ?', [result.insertId]);
    return sendSuccess(res, row[0], 'Speciality created', 201);
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, sort_order, status } = req.body;
    const [existing] = await db.query('SELECT * FROM specialities WHERE id = ?', [id]);
    if (existing.length === 0) return sendError(res, 'Speciality not found', 404);
    await db.query(
      'UPDATE specialities SET title = ?, description = ?, icon = ?, sort_order = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [title || existing[0].title, description !== undefined ? description : existing[0].description, icon || existing[0].icon, sort_order !== undefined ? sort_order : existing[0].sort_order, status || existing[0].status, id]
    );
    const [row] = await db.query('SELECT * FROM specialities WHERE id = ?', [id]);
    return sendSuccess(res, row[0], 'Speciality updated');
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

const remove = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM specialities WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return sendError(res, 'Speciality not found', 404);
    await db.query('DELETE FROM specialities WHERE id = ?', [req.params.id]);
    return sendSuccess(res, null, 'Speciality deleted');
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

module.exports = { getAll, create, update, remove };
