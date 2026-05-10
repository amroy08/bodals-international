const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { productUpload } = require('../middleware/uploadMiddleware');

// Public
router.get('/', getAll);
router.get('/:id', getById);

// Admin protected
router.post('/', authMiddleware, productUpload.single('image'), create);
router.put('/:id', authMiddleware, productUpload.single('image'), update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
