const express = require('express');
const router = express.Router();

const {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/homeVideoController');

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// 🔓 Public access to get videos
router.get('/', getAllVideos);

// 🔐 Protected admin routes
router.use(verifyToken, roleGuard(['Admin']));

// ➕ Create a video (with optional thumbnail and/or video file)
router.post('/', upload.fields([
  { name: 'video_thumb', maxCount: 1 },
  { name: 'video_file', maxCount: 1 } // ✅ new field
]), createVideo);

// ✏️ Update a video
router.put('/:id', upload.fields([
  { name: 'video_thumb', maxCount: 1 },
  { name: 'video_file', maxCount: 1 } // ✅ also support update of video file
]), updateVideo);

// 🗑️ Delete a video
router.delete('/:id', deleteVideo);

module.exports = router;
