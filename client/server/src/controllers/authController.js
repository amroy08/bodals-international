const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (rows.length === 0) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return sendSuccess(res, {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email }
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 'Server error during login');
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    );

    if (rows.length === 0) {
      return sendError(res, 'Admin not found', 404);
    }

    return sendSuccess(res, rows[0]);
  } catch (error) {
    console.error('GetMe error:', error);
    return sendError(res, 'Server error');
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  return sendSuccess(res, null, 'Logged out successfully');
};

module.exports = { login, getMe, logout };
