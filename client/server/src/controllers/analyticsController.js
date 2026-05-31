const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const trackVisit = async (req, res) => {
  try {
    const { page, device, browser } = req.body;
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || '0.0.0.0';
    await db.query(
      `INSERT INTO visitors (ip_address, country, city, page, device, browser, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [ip_address.split(',')[0].trim(), req.body.country || 'Unknown', req.body.city || 'Unknown', page || '/', device || 'Unknown', browser || 'Unknown']
    );
    return sendSuccess(res, null, 'Visit tracked');
  } catch (error) {
    return sendSuccess(res, null, 'Visit tracked');
  }
};

const getDashboard = async (req, res) => {
  try {
    const [totalVisitors] = await db.query('SELECT COUNT(*) as total FROM visitors');
    const [uniqueVisitors] = await db.query('SELECT COUNT(DISTINCT ip_address) as total FROM visitors');
    const [countries] = await db.query('SELECT COUNT(DISTINCT country) as total FROM visitors WHERE country != "Unknown"');
    const [totalEnquiries] = await db.query('SELECT COUNT(*) as total FROM enquiries');
    const [enquiryStatus] = await db.query('SELECT status, COUNT(*) as count FROM enquiries GROUP BY status');
    const [totalProducts] = await db.query('SELECT COUNT(*) as total FROM products WHERE status = "active"');
    const [totalCerts] = await db.query('SELECT COUNT(*) as total FROM certifications WHERE status = "active"');
    const [weeklyVisitors] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as visits FROM visitors WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date ASC`
    );
    const [recentEnquiries] = await db.query('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5');
    return sendSuccess(res, { totalVisitors: totalVisitors[0].total, uniqueVisitors: uniqueVisitors[0].total, countriesReached: countries[0].total, totalEnquiries: totalEnquiries[0].total, enquiryStatus, totalProducts: totalProducts[0].total, totalCertifications: totalCerts[0].total, weeklyVisitors, recentEnquiries });
  } catch (error) {
    console.error('Dashboard error:', error);
    return sendError(res, 'Server error');
  }
};

const getCountries = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT country, COUNT(*) as visits FROM visitors WHERE country != 'Unknown' GROUP BY country ORDER BY visits DESC LIMIT 20`);
    return sendSuccess(res, rows);
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

const getRecentVisitors = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM visitors ORDER BY created_at DESC LIMIT 50');
    return sendSuccess(res, rows);
  } catch (error) {
    return sendError(res, 'Server error');
  }
};

module.exports = { trackVisit, getDashboard, getCountries, getRecentVisitors };
