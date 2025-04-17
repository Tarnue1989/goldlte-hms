// routes/slideRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide
} = require('../controllers/slideController');

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// ✅ Public access to view slides
router.get('/', getAllSlides);

// 🔐 Admin-only access for modifications
router.use(verifyToken, roleGuard(['Admin']));

router.post('/', upload.single('slide'), createSlide);
router.put('/:id', updateSlide);
router.delete('/:id', deleteSlide);

module.exports = router;
