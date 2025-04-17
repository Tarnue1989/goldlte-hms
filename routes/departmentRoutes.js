const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');

const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

// 🔐 Admin-only access for all department routes
router.use(verifyToken, roleGuard(['Admin']));

// 📄 Get all departments
router.get('/', getDepartments);

// ➕ Create department
router.post('/', createDepartment);

// ✏️ Update department
router.put('/:id', updateDepartment);

// 🗑️ Soft delete department
router.delete('/:id', deleteDepartment);

module.exports = router;
