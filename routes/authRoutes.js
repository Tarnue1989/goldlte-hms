// routes/authRoutes.js

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logoutUser,
  changePassword
} = require('../controllers/authController');

const validate = require('../middleware/validate');
const verifyToken = require('../middleware/authMiddleware');

// 🔐 AUTH ROUTES

// 📝 Register User
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').notEmpty().withMessage('Full name is required') // ✅ fixed from fullName → full_name
  ],
  validate,
  registerUser
);

// 🔓 Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  loginUser
);

// 🔄 Refresh Token
router.post('/refresh', refreshToken);

// 👤 Get Logged-In User Info
router.get('/me', verifyToken, getMe);

// 🚪 Logout
router.post('/logout', logoutUser);

// 🔁 Change Password (FORCED reset, no current password required)
router.post(
  '/change-password',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  validate,
  changePassword
);


module.exports = router;
