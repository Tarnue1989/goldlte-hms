const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  toggleUserStatus
} = require('../controllers/userController');

// 🔐 Protect all routes — accessible to Admins only
router.use(verifyToken, roleGuard(['Admin']));

// 📄 Get all users
router.get('/', getUsers);

// ➕ Create user
router.post('/', createUser);

// ✏️ Update user
router.put('/:id', updateUser);

// 🔁 Reset user password to default
router.put('/:id/reset-password', resetUserPassword);

// 🔄 Toggle enable/disable account status
router.put('/:id/toggle-status', toggleUserStatus);

// 🗑️ Soft delete user
router.delete('/:id', deleteUser);

module.exports = router;
