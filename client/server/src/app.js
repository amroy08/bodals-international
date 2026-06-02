const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS — allow both local dev and production
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://bodalsint.com',
  'https://www.bodalsint.com',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now since it's a public API
    }
  },
  credentials: true
}));

// Security & SEO headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const { uploadsDir } = require('./utils/pathHelper');

// Serve uploaded files statically with long cache
app.use('/api/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  etag: true,
}));

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

// Serve static frontend files in production with cache headers
app.use(express.static(path.join(__dirname, '../../dist'), {
  maxAge: '1d',
  etag: true,
  setHeaders: (res, filePath) => {
    // Cache JS/CSS for longer since they have content hashes
    if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
    }
    // Cache images for 7 days
    if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
    }
  },
}));

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

