const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bodals_international',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const fs = require('fs');
const path = require('path');

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully');
    conn.release();
    try {
      const errorLogPath = path.join(__dirname, '../../../dist/error.txt');
      if (fs.existsSync(errorLogPath)) fs.unlinkSync(errorLogPath);
    } catch (e) {}
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    try {
      const errorLogPath = path.join(__dirname, '../../../dist/error.txt');
      fs.writeFileSync(
        errorLogPath,
        `MySQL Connection Error on Hostinger:\n` +
        `Host: ${process.env.DB_HOST}\n` +
        `User: ${process.env.DB_USER}\n` +
        `DB: ${process.env.DB_NAME}\n` +
        `Message: ${err.message}\n` +
        `Stack: ${err.stack}\n`
      );
    } catch (e) {
      console.error('Failed to write error.txt:', e.message);
    }
  });

module.exports = pool;
