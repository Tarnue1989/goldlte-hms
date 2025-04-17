const express = require('express');
const router = express.Router();

const {
  getAboutContent,
  createAboutContent,
  updateAboutContent,
  deleteAboutContent
} = require('../controllers/homeAboutController');

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');

// 🔓 Public access: Get About content
router.get('/', getAboutContent);

// 🔐 Protect all following routes for Admin only
router.use(verifyToken, roleGuard(['Admin']));

// ➕ Create new About content (only one per lang)
router.post('/', createAboutContent);

// ✏️ Update existing About content
router.put('/:id', updateAboutContent);

// 🗑️ Soft delete About content
router.delete('/:id', deleteAboutContent);

module.exports = router;
