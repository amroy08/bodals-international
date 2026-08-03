const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/websiteController');
const authMiddleware = require('../middleware/authMiddleware');
const { logoUpload } = require('../middleware/uploadMiddleware');

router.get('/settings', getSettings);
router.put('/settings', authMiddleware, logoUpload.single('logo'), updateSettings);

module.exports = router;
