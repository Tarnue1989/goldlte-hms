// routes/settingsRoutes.js

const express = require('express');
const router = express.Router();

const {
  getSettings,
  updateSettings,
  uploadLogoOrFavicon,
  deleteLogo,
  deleteSettings // ✅ Soft-delete system settings
} = require('../controllers/systemSettingsController');

const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ✅ Public route to load current branding/logo settings (used on login, homepage, etc.)
router.get('/', getSettings);

// 🔐 Admin-only: update or delete system-wide settings
router.put('/', verifyToken, updateSettings);
router.delete('/', verifyToken, deleteSettings);

// 🔐 Admin-only: upload logo and/or favicon
router.post(
  '/logo',
  verifyToken,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
  ]),
  uploadLogoOrFavicon
);

// 🔐 Admin-only: remove logo file and DB path
router.delete('/logo', verifyToken, deleteLogo);

module.exports = router;
