const express = require('express');
const router = express.Router();

// ✅ Import route modules
const serviceRoutes = require('./serviceRoutes');
const slideRoutes = require('./slideRoutes');
const videoRoutes = require('./homeVideoRoutes');
const settingsRoutes = require('./settingsRoutes');
const aboutRoutes = require('./homeAboutRoutes');
const announcementRoutes = require('./announcementRoutes');
const locationRoutes = require('./locationRoutes');

// 🔓 Allow public access for homepage (GET requests only)
router.use('/services', serviceRoutes);
router.use('/slides', slideRoutes);
router.use('/videos', videoRoutes);
router.use('/settings', settingsRoutes);
router.use('/about', aboutRoutes);
router.use('/announcements', announcementRoutes);
router.use('/locations', locationRoutes);

module.exports = router;
