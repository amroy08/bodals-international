const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

// GET /api/website/settings (public)
const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM website_settings LIMIT 1');

    if (rows.length === 0) {
      return sendError(res, 'Website settings not found', 404);
    }

    return sendSuccess(res, rows[0]);
  } catch (error) {
    console.error('Get settings error:', error);
    return sendError(res, 'Server error');
  }
};

// PUT /api/website/settings (admin)
const updateSettings = async (req, res) => {
  try {
    const {
      company_name, motto, hero_title, hero_subtitle,
      about_us, vision, purpose,
      mobile, email, address,
      facebook_url, instagram_url, linkedin_url, whatsapp_url,
      footer_text
    } = req.body;

    // Build update fields dynamically
    const fields = {};
    if (company_name !== undefined) fields.company_name = company_name;
    if (motto !== undefined) fields.motto = motto;
    if (hero_title !== undefined) fields.hero_title = hero_title;
    if (hero_subtitle !== undefined) fields.hero_subtitle = hero_subtitle;
    if (about_us !== undefined) fields.about_us = about_us;
    if (vision !== undefined) fields.vision = vision;
    if (purpose !== undefined) fields.purpose = purpose;
    if (mobile !== undefined) fields.mobile = mobile;
    if (email !== undefined) fields.email = email;
    if (address !== undefined) fields.address = address;
    if (facebook_url !== undefined) fields.facebook_url = facebook_url;
    if (instagram_url !== undefined) fields.instagram_url = instagram_url;
    if (linkedin_url !== undefined) fields.linkedin_url = linkedin_url;
    if (whatsapp_url !== undefined) fields.whatsapp_url = whatsapp_url;
    if (footer_text !== undefined) fields.footer_text = footer_text;

    // Handle logo upload
    if (req.file) {
      // Delete old logo if exists
      const [existing] = await db.query('SELECT logo FROM website_settings LIMIT 1');
      if (existing.length > 0 && existing[0].logo) {
        const oldPath = path.join(__dirname, '../../uploads', existing[0].logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      fields.logo = 'logo/' + req.file.filename;
    }

    if (Object.keys(fields).length === 0) {
      return sendError(res, 'No fields to update', 400);
    }

    fields.updated_at = new Date();

    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');

    await db.query(`UPDATE website_settings SET ${setClause} WHERE id = 1`, values);

    const [updated] = await db.query('SELECT * FROM website_settings WHERE id = 1');
    return sendSuccess(res, updated[0], 'Website settings updated');
  } catch (error) {
    console.error('Update settings error:', error);
    return sendError(res, 'Server error');
  }
};

module.exports = { getSettings, updateSettings };
