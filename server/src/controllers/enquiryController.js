const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// POST /api/enquiries (public)
const create = async (req, res) => {
  try {
    const { name, position, company, email, mobile, city_country, message } = req.body;

    // Validation
    if (!name || !email || !mobile || !message) {
      return sendError(res, 'Name, email, mobile, and message are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    const [result] = await db.query(
      `INSERT INTO enquiries (name, position, company, email, mobile, city_country, message, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'New', NOW(), NOW())`,
      [name, position || '', company || '', email, mobile, city_country || '', message]
    );

    return sendSuccess(res, { id: result.insertId }, 'Enquiry submitted successfully', 201);
  } catch (error) {
    console.error('Create enquiry error:', error);
    return sendError(res, 'Server error');
  }
};

// GET /api/enquiries (admin)
const getAll = async (req, res) => {
  try {
    const { search, status, country, from_date, to_date, page = 1, limit = 20 } = req.query;
    let query = 'SELECT * FROM enquiries';
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(name LIKE ? OR company LIKE ? OR email LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (country) {
      conditions.push('city_country LIKE ?');
      params.push(`%${country}%`);
    }
    if (from_date) {
      conditions.push('DATE(created_at) >= ?');
      params.push(from_date);
    }
    if (to_date) {
      conditions.push('DATE(created_at) <= ?');
      params.push(to_date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';

    // Count total
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

    const [rows] = await db.query(query, params);

    return sendSuccess(res, {
      enquiries: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get enquiries error:', error);
    return sendError(res, 'Server error');
  }
};

// GET /api/enquiries/:id (admin)
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM enquiries WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return sendError(res, 'Enquiry not found', 404);
    }
    return sendSuccess(res, rows[0]);
  } catch (error) {
    console.error('Get enquiry error:', error);
    return sendError(res, 'Server error');
  }
};

// PUT /api/enquiries/:id/status (admin)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['New', 'Contacted', 'Closed'].includes(status)) {
      return sendError(res, 'Valid status required: New, Contacted, or Closed', 400);
    }

    const [existing] = await db.query('SELECT * FROM enquiries WHERE id = ?', [id]);
    if (existing.length === 0) {
      return sendError(res, 'Enquiry not found', 404);
    }

    await db.query('UPDATE enquiries SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);

    const [updated] = await db.query('SELECT * FROM enquiries WHERE id = ?', [id]);
    return sendSuccess(res, updated[0], 'Enquiry status updated');
  } catch (error) {
    console.error('Update enquiry status error:', error);
    return sendError(res, 'Server error');
  }
};

// DELETE /api/enquiries/:id (admin)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM enquiries WHERE id = ?', [id]);
    if (existing.length === 0) {
      return sendError(res, 'Enquiry not found', 404);
    }

    await db.query('DELETE FROM enquiries WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Enquiry deleted');
  } catch (error) {
    console.error('Delete enquiry error:', error);
    return sendError(res, 'Server error');
  }
};

module.exports = { create, getAll, getById, updateStatus, remove };
