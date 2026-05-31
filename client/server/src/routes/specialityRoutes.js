const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/specialityController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAll); // Public
router.post('/', authMiddleware, create);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
