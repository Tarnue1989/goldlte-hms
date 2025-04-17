const express = require('express');
const router = express.Router();

const {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');

// 📍 Public access to fetch all locations (e.g., for homepage/map)
router.get('/', getAllLocations);

// 🔐 Admin-only routes
router.use(verifyToken, roleGuard(['Admin']));

// ➕ Create new location
router.post('/', createLocation);

// ✏️ Update existing location
router.put('/:id', updateLocation);

// 🗑️ Soft delete location
router.delete('/:id', deleteLocation);

module.exports = router;
