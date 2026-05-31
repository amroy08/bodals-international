const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { productUpload } = require('../middleware/uploadMiddleware');

// Public
router.get('/', getAll);
router.get('/:id', getById);

// Admin protected
router.post('/', authMiddleware, productUpload.array('images', 10), create);
router.put('/:id', authMiddleware, productUpload.array('images', 10), update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
