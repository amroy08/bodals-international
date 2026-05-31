const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const websiteRoutes = require('./routes/websiteRoutes');
const productRoutes = require('./routes/productRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const specialityRoutes = require('./routes/specialityRoutes');
const coreValueRoutes = require('./routes/coreValueRoutes');
const sectionImageRoutes = require('./routes/sectionImageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/products', productRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/specialities', specialityRoutes);
app.use('/api/core-values', coreValueRoutes);
app.use('/api/section-images', sectionImageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '../../dist')));

// Fallback to React's index.html for non-API/non-upload routes (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large' });
  }
  if (err.message && err.message.includes('Only')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;

