const router = require('express').Router();
const { create, getAll, getById, updateStatus, remove } = require('../controllers/enquiryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', create); // Public
router.get('/', authMiddleware, getAll);
router.get('/:id', authMiddleware, getById);
router.put('/:id/status', authMiddleware, updateStatus);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
