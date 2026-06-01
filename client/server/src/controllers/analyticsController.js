const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

const trackVisit = async (req, res) => {
  try {
    const { page, device, browser } = req.body;
    let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || '0.0.0.0';
    ip_address = ip_address.split(',')[0].trim();

    // Default values
    let country = 'Unknown';
    let city = 'Unknown';

    // If it's a real public IP (not localhost or internal), let's do a fast geo-lookup
    if (ip_address && ip_address !== '127.0.0.1' && ip_address !== '::1' && ip_address !== '0.0.0.0' && !ip_address.startsWith('::ffff:')) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip_address}`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.status === 'success') {
            country = geoData.country || 'Unknown';
            city = geoData.city || 'Unknown';
          }
        }
      } catch (geoError) {
        console.error('Geo lookup failed:', geoError);
      }
    }

    await db.query(
      `INSERT INTO visitors (ip_address, country, city, page, device, browser, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [ip_address, country, city, page || '/', device || 'Unknown', browser || 'Unknown']
    );
    return sendSuccess(res, null, 'Visit tracked');
  } catch (error) {
    console.error('Track visit error:', error);
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
    
    // Existing 7 days (for main dashboard)
    const [weeklyVisitors] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as visits FROM visitors WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date ASC`
    );
    
    // New 14 days (for detailed analytics trend)
    const [trendVisitors] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as visits FROM visitors WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY) GROUP BY DATE(created_at) ORDER BY date ASC`
    );

    // New Popular Pages (top 8)
    const [popularPages] = await db.query(
      `SELECT page, COUNT(*) as visits FROM visitors GROUP BY page ORDER BY visits DESC LIMIT 8`
    );

    // New Browser Breakdown (entire database)
    const [browsers] = await db.query(
      `SELECT browser, COUNT(*) as count FROM visitors GROUP BY browser ORDER BY count DESC`
    );

    // New Device Breakdown (entire database)
    const [devices] = await db.query(
      `SELECT device, COUNT(*) as count FROM visitors GROUP BY device ORDER BY count DESC`
    );

    const [recentEnquiries] = await db.query('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5');
    
    return sendSuccess(res, { 
      totalVisitors: totalVisitors[0].total, 
      uniqueVisitors: uniqueVisitors[0].total, 
      countriesReached: countries[0].total, 
      totalEnquiries: totalEnquiries[0].total, 
      enquiryStatus, 
      totalProducts: totalProducts[0].total, 
      totalCertifications: totalCerts[0].total, 
      weeklyVisitors, 
      trendVisitors,
      popularPages,
      browsers,
      devices,
      recentEnquiries 
    });
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
