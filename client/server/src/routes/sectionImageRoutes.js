const router = require('express').Router();
const { getBySection, getAll, create, update, remove } = require('../controllers/sectionImageController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '../../uploads/section-images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, 'section-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

router.get('/section/:section', getBySection); // Public
router.get('/', authMiddleware, getAll);
router.post('/', authMiddleware, upload.single('image'), create);
router.put('/:id', authMiddleware, upload.single('image'), update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;
