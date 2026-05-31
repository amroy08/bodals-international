const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/certificationController');
const authMiddleware = require('../middleware/authMiddleware');
const { certificationUpload } = require('../middleware/uploadMiddleware');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authMiddleware, certificationUpload.single('document'), create);
router.put('/:id', authMiddleware, certificationUpload.single('document'), update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
