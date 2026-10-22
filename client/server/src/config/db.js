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

// Helper to safely ensure new columns exist in website_settings
async function ensureWebsiteSettingsColumns(conn) {
  const newCols = [
    { name: 'show_certificates', def: 'BOOLEAN DEFAULT FALSE' },
    { name: 'stat_quality', def: "VARCHAR(50) DEFAULT '100%'" },
    { name: 'stat_reach', def: "VARCHAR(50) DEFAULT '5'" },
    { name: 'stat_partnerships', def: "VARCHAR(50) DEFAULT '10'" },
    { name: 'stat_shipments', def: "VARCHAR(50) DEFAULT '0'" },
    { name: 'brochure_pdf', def: 'VARCHAR(500) DEFAULT NULL' },
    { name: 'seo_meta_title', def: "VARCHAR(500) DEFAULT 'BODALS INTERNATIONAL — Global Export & Sourcing'" },
    { name: 'seo_meta_description', def: "TEXT DEFAULT NULL" },
    { name: 'seo_meta_keywords', def: "TEXT DEFAULT NULL" },
    { name: 'announcement_enabled', def: 'BOOLEAN DEFAULT FALSE' },
    { name: 'announcement_text', def: "VARCHAR(500) DEFAULT ''" },
    { name: 'announcement_link', def: "VARCHAR(500) DEFAULT ''" },
    { name: 'working_hours', def: "VARCHAR(255) DEFAULT 'Mon – Sat: 9:00 AM – 7:00 PM IST'" },
    { name: 'section_brochure_enabled', def: 'BOOLEAN DEFAULT TRUE' },
    { name: 'section_specialities_enabled', def: 'BOOLEAN DEFAULT TRUE' },
    { name: 'section_intro_animation_enabled', def: 'BOOLEAN DEFAULT TRUE' },
  ];
  for (const col of newCols) {
    try {
      const [exists] = await conn.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'website_settings' AND COLUMN_NAME = ?`,
        [col.name]
      );
      if (exists.length === 0) {
        await conn.query(`ALTER TABLE website_settings ADD COLUMN ${col.name} ${col.def}`);
        console.log(`✅ Added column ${col.name} to website_settings`);
      }
    } catch (e) {
      console.warn(`Column check/add for ${col.name}:`, e.message);
    }
  }
}

// Test connection on startup
pool.getConnection()
  .then(async conn => {
    console.log('✅ MySQL connected successfully');
    await ensureWebsiteSettingsColumns(conn);
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
