const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');

const {
  getRoles,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roleController');

// 🔐 Admin-only access to all role routes
router.use(verifyToken, roleGuard(['Admin']));

// 📄 Get all roles
router.get('/', getRoles);

// ➕ Create a new role
router.post('/', createRole);

// ✏️ Update an existing role
router.put('/:id', updateRole);

// 🗑️ Soft delete a role
router.delete('/:id', deleteRole);

module.exports = router;
