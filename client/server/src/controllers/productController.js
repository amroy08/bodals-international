const db = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');
const { uploadsDir } = require('../utils/pathHelper');

// GET /api/products (public)
const getAll = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    } else {
      // Public access — only show active products
      if (!req.admin) {
        conditions.push('status = ?');
        params.push('active');
      }
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    return sendSuccess(res, rows);
  } catch (error) {
    console.error('Get products error:', error);
    return sendError(res, 'Server error');
  }
};

// GET /api/products/:id (public)
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return sendError(res, 'Product not found', 404);
    }

    return sendSuccess(res, rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    return sendError(res, 'Server error');
  }
};

// POST /api/products (admin)
const create = async (req, res) => {
  try {
    const { name, category, short_description, full_description, badges, status } = req.body;

    if (!name || !category) {
      return sendError(res, 'Name and category are required', 400);
    }

    const images = req.files ? req.files.map(f => 'products/' + f.filename) : [];
    const mainImage = images.length > 0 ? images[0] : null;
    const imagesJson = JSON.stringify(images);
    const badgesJson = badges ? (typeof badges === 'string' ? badges : JSON.stringify(badges)) : '[]';

    const [result] = await db.query(
      `INSERT INTO products (name, category, short_description, full_description, image, images, badges, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, category, short_description || '', full_description || '', mainImage, imagesJson, badgesJson, status || 'active']
    );

    const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    return sendSuccess(res, newProduct[0], 'Product created', 201);
  } catch (error) {
    console.error('Create product error:', error);
    return sendError(res, 'Server error');
  }
};

// PUT /api/products/:id (admin)
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, short_description, full_description, badges, status } = req.body;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return sendError(res, 'Product not found', 404);
    }

    // Determine existing images list to keep
    let existingImages = [];
    if (req.body.existing_images) {
      try {
        existingImages = typeof req.body.existing_images === 'string' ? JSON.parse(req.body.existing_images) : req.body.existing_images;
      } catch (e) {
        existingImages = [];
      }
    } else {
      existingImages = existing[0].images ? (typeof existing[0].images === 'string' ? JSON.parse(existing[0].images) : existing[0].images) : [];
      if (existingImages.length === 0 && existing[0].image) {
        existingImages = [existing[0].image];
      }
    }

    // Get new files uploaded
    const newImages = req.files ? req.files.map(f => 'products/' + f.filename) : [];
    const combinedImages = [...existingImages, ...newImages];

    // Clean up deleted images from disk
    const oldImages = existing[0].images ? (typeof existing[0].images === 'string' ? JSON.parse(existing[0].images) : existing[0].images) : [];
    if (oldImages.length === 0 && existing[0].image) {
      oldImages.push(existing[0].image);
    }

    oldImages.forEach(oldImg => {
      if (!combinedImages.includes(oldImg)) {
        const oldPath = path.join(uploadsDir, oldImg);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.error('Failed to unlink old image:', e); }
        }
      }
    });

    const mainImage = combinedImages.length > 0 ? combinedImages[0] : null;
    const imagesJson = JSON.stringify(combinedImages);
    const badgesJson = badges ? (typeof badges === 'string' ? badges : JSON.stringify(badges)) : existing[0].badges;

    await db.query(
      `UPDATE products SET name = ?, category = ?, short_description = ?, full_description = ?,
       image = ?, images = ?, badges = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [
        name || existing[0].name,
        category || existing[0].category,
        short_description !== undefined ? short_description : existing[0].short_description,
        full_description !== undefined ? full_description : existing[0].full_description,
        mainImage,
        imagesJson,
        badgesJson,
        status || existing[0].status,
        id
      ]
    );

    const [updated] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return sendSuccess(res, updated[0], 'Product updated');
  } catch (error) {
    console.error('Update product error:', error);
    return sendError(res, 'Server error');
  }
};

// DELETE /api/products/:id (admin)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return sendError(res, 'Product not found', 404);
    }

    // Delete all images in the images array from disk
    const oldImages = existing[0].images ? (typeof existing[0].images === 'string' ? JSON.parse(existing[0].images) : existing[0].images) : [];
    if (oldImages.length === 0 && existing[0].image) {
      oldImages.push(existing[0].image);
    }

    oldImages.forEach(oldImg => {
      const imgPath = path.join(uploadsDir, oldImg);
      if (fs.existsSync(imgPath)) {
        try { fs.unlinkSync(imgPath); } catch (e) { console.error('Failed to delete image file during product removal:', e); }
      }
    });

    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return sendSuccess(res, null, 'Product deleted');
  } catch (error) {
    console.error('Delete product error:', error);
    return sendError(res, 'Server error');
  }
};

module.exports = { getAll, getById, create, update, remove };
