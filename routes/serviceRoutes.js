const express = require('express');
const router = express.Router();

const {
  getAllServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload'); // ✅ File upload utility

// 📄 Public access: load services for homepage or public views
router.get('/', getAllServices);

// 🔐 Protect everything else: Admin only
router.use(verifyToken, roleGuard(['Admin']));

// ➕ Create service (with optional icon)
router.post('/', upload.single('service_icon'), createService);

// ✏️ Update service (icon optional)
router.put('/:id', upload.single('service_icon'), updateService);

// 🗑️ Soft delete service
router.delete('/:id', deleteService);

module.exports = router;
