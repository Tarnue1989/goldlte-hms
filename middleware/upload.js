const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🛠 Ensure directory exists
const ensureFolder = folderPath => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// 📁 Asset paths
const paths = {
  profile: path.join(__dirname, '../public/assets/profiles'),
  resume: path.join(__dirname, '../public/assets/resumes'),
  slide: path.join(__dirname, '../public/assets/slides'),
  service: path.join(__dirname, '../public/assets/services'),
  video: path.join(__dirname, '../public/assets/videos'),
  logo: path.join(__dirname, '../public/assets/logos'),
  misc: path.join(__dirname, '../public/assets/misc')
};

// 🔁 Ensure folders exist
Object.values(paths).forEach(ensureFolder);

// 🎯 Dynamic folder based on field name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldMap = {
      profile_picture: paths.profile,
      resume_url: paths.resume,
      slide: paths.slide,
      service_icon: paths.service,
      video_thumb: paths.video,
      video_file: paths.video,       // ✅ NEW
      logo: paths.logo,
      favicon: paths.logo
    };
    const targetDir = fieldMap[file.fieldname] || paths.misc;
    ensureFolder(targetDir);
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// 🔐 Type validation
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
const allowedDocTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

const fileFilter = (req, file, cb) => {
  const isImage = ['profile_picture', 'slide', 'service_icon', 'video_thumb', 'logo', 'favicon'].includes(file.fieldname);
  const isDocument = file.fieldname === 'resume_url';
  const isVideo = file.fieldname === 'video_file';

  if (isImage && allowedImageTypes.includes(file.mimetype)) return cb(null, true);
  if (isDocument && allowedDocTypes.includes(file.mimetype)) return cb(null, true);
  if (isVideo && allowedVideoTypes.includes(file.mimetype)) return cb(null, true);

  return cb(new Error('❌ Unsupported file type'), false);
};

// 🎬 Export config
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // Max 25MB for videos
});

module.exports = upload;
