const express = require('express');
const router = express.Router();

const {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');

// 🔓 Public: Fetch all announcements (for homepage)
router.get('/', getAllAnnouncements);

// 🔐 Admin-only for create, update, delete
router.use(verifyToken, roleGuard(['Admin']));

// ➕ Create new announcement
router.post('/', createAnnouncement);

// ✏️ Update announcement
router.put('/:id', updateAnnouncement);

// 🗑️ Delete announcement
router.delete('/:id', deleteAnnouncement);

module.exports = router;
