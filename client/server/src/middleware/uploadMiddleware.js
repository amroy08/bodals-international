const multer = require('multer');
const path = require('path');
const { getUploadPath } = require('../utils/pathHelper');

// Storage for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadPath('products'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for certification documents
const certificationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadPath('certifications'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cert-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for logo
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadPath('logo'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  console.log('Image upload attempt:', { name: file.originalname, mimetype: file.mimetype, extnameMatch: extname, mimeMatch: mimetype });
  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp, gif) are allowed'), false);
  }
};

// File filter for documents (images + PDF)
const documentFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /jpeg|jpg|png|webp|pdf/.test(file.mimetype);
  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed'), false);
  }
};

const productUpload = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

const certificationUpload = multer({
  storage: certificationStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

const logoUpload = multer({
  storage: logoStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Storage for brochure PDF
const brochureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadPath('brochure'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'brochure-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const brochureFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for brochure'), false);
  }
};

const brochureUpload = multer({
  storage: brochureStorage,
  fileFilter: brochureFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Multi-storage for settings: logo or brochure
const settingsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'brochure') {
      cb(null, getUploadPath('brochure'));
    } else {
      cb(null, getUploadPath('logo'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.fieldname === 'brochure' ? 'brochure-' : 'logo-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

const settingsFilter = (req, file, cb) => {
  if (file.fieldname === 'brochure') {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed for brochure'), false);
  } else {
    imageFilter(req, file, cb);
  }
};

const settingsUpload = multer({
  storage: settingsStorage,
  fileFilter: settingsFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = { productUpload, certificationUpload, logoUpload, brochureUpload, settingsUpload };
