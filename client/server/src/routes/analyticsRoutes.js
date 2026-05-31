const router = require('express').Router();
const { trackVisit, getDashboard, getCountries, getRecentVisitors } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/track-visit', trackVisit); // Public
router.get('/dashboard', authMiddleware, getDashboard);
router.get('/countries', authMiddleware, getCountries);
router.get('/recent-visitors', authMiddleware, getRecentVisitors);

module.exports = router;
