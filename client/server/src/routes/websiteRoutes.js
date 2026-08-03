const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/websiteController');
const authMiddleware = require('../middleware/authMiddleware');
const { logoUpload } = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');
const { uploadsDir } = require('../utils/pathHelper');

router.get('/settings', getSettings);
router.put('/settings', authMiddleware, logoUpload.single('logo'), updateSettings);

router.get('/debug-path', (req, res) => {
  const isHostinger = __dirname.includes('u110119377') || process.env.NODE_ENV === 'production';
  const logoDir = path.join(uploadsDir, 'logo');
  const productsDir = path.join(uploadsDir, 'products');
  const sectionDir = path.join(uploadsDir, 'section-images');
  
  res.json({
    __dirname,
    uploadsDir,
    cwd: process.cwd(),
    isHostinger,
    env: process.env.NODE_ENV,
    exists: fs.existsSync(uploadsDir),
    files: {
      logo: fs.existsSync(logoDir) ? fs.readdirSync(logoDir) : [],
      products: fs.existsSync(productsDir) ? fs.readdirSync(productsDir) : [],
      sectionImages: fs.existsSync(sectionDir) ? fs.readdirSync(sectionDir) : [],
    }
  });
});

module.exports = router;
