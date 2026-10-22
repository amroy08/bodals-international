const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/websiteController');
const authMiddleware = require('../middleware/authMiddleware');
const { settingsUpload } = require('../middleware/uploadMiddleware');

router.get('/settings', getSettings);
router.put(
  '/settings',
  authMiddleware,
  settingsUpload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
  ]),
  updateSettings
);

module.exports = router;
