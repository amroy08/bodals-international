const path = require('path');
const fs = require('fs');

const isHostinger = __dirname.includes('u110119377') || process.env.NODE_ENV === 'production';

// In production, store uploads outside the git folder 'nodejs' so they are never wiped
// Home folder is /home/u110119377, we store it in /home/u110119377/persistent-uploads
const uploadsDir = isHostinger
  ? path.resolve(__dirname, '../../../../../../persistent-uploads')
  : path.resolve(__dirname, '../../uploads');

// Ensure directories exist
const subdirs = ['products', 'certifications', 'logo', 'section-images'];
subdirs.forEach(sub => {
  const dirPath = path.join(uploadsDir, sub);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

module.exports = {
  uploadsDir,
  getUploadPath: (subDir) => path.join(uploadsDir, subDir)
};
