const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const verifyToken = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleMiddleware');

const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// 🔐 Apply authentication and Admin-only access to all routes
router.use(verifyToken, roleGuard(['Admin']));

// 📄 Get all employees
router.get('/', getEmployees);

// ➕ Create employee (with profile/resume upload)
router.post(
  '/',
  upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'resume_url', maxCount: 1 }
  ]),
  createEmployee
);

// ✏️ Update employee (with profile/resume upload)
router.put(
  '/:id',
  upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'resume_url', maxCount: 1 }
  ]),
  updateEmployee
);

// 🗑️ Soft delete employee
router.delete('/:id', deleteEmployee);

module.exports = router;
