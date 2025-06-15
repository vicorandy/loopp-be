// middleware/upload.js
const multer = require('multer');

// Store uploads in memory — we’ll stream to Cloudinary directly
const storage = multer.memoryStorage();
const upload = multer({ storage,limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  } });

module.exports = upload;