const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

const MAX_LOGIN_ATTEMPTS = 5;

// 🔐 Register new user
exports.registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role_id } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: '❌ Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role_id,
      must_change_password: true,
    });

    res.status(201).json({ message: '✅ User registered successfully', user });
  } catch (err) {
    console.error('❌ Register Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// 🔐 Login with lockout and password reset
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ['role_name'] }],
    });

    if (!user) return res.status(404).json({ message: '❌ User not found.' });

    if (user.is_disabled) {
      return res.status(403).json({ message: '❌ Account is disabled. Contact Admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      user.login_attempts += 1;

      if (user.login_attempts >= MAX_LOGIN_ATTEMPTS) {
        user.is_disabled = true;
        await user.save();
        return res.status(403).json({ message: '❌ Account locked due to too many failed login attempts.' });
      }

      await user.save();
      return res.status(401).json({ message: '❌ Incorrect password.' });
    }

    if (user.must_change_password) {
      const tempToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );

      return res.status(401).json({
        forceReset: true,
        message: '⚠️ Password reset required before login.',
        tempToken,
        userId: user.id,
      });
    }

    user.login_attempts = 0;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: '✅ Login successful',
      accessToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        department_id: user.department_id,
        role: user.Role?.role_name || 'Unknown',
      },
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// 🔄 Refresh access token
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: '❌ No refresh token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded.id, { include: Role });

    if (!user) return res.status(404).json({ message: '❌ User not found' });

    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.Role ? user.Role.role_name : user.role_id,
      },
    });
  } catch (err) {
    console.error('❌ Refresh Token Error:', err);
    res.status(403).json({ message: '❌ Invalid or expired refresh token' });
  }
};

// 👤 Get current user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [{ model: Role, attributes: ['role_name'] }],
      attributes: ['id', 'full_name', 'email'],
    });

    if (!user) return res.status(404).json({ message: '❌ User not found' });

    res.json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.Role ? user.Role.role_name : user.role_id,
    });
  } catch (err) {
    console.error('❌ GetMe Error:', err);
    res.status(500).json({ message: 'Failed to fetch user info' });
  }
};

// 🔓 Logout user
exports.logoutUser = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: '✅ Logged out successfully' });
};

// 🔁 Handle password change after forced reset
exports.changePassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  const tempToken = req.headers.authorization?.split(' ')[1]; // Expect "Bearer <token>"

  if (!userId || !newPassword || !tempToken) {
    return res.status(400).json({ message: '❌ Missing required fields or token.' });
  }

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    if (decoded.id !== userId) {
      return res.status(401).json({ message: '❌ Unauthorized password reset.' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: '❌ User not found.' });

    user.password_hash = await bcrypt.hash(newPassword, 10);
    user.must_change_password = false;
    user.login_attempts = 0;
    user.is_disabled = false;

    await user.save();

    res.json({ message: '✅ Password changed. Please log in with your new password.' });
  } catch (err) {
    console.error('❌ Change Password Error:', err);
    res.status(401).json({ message: '❌ Invalid or expired token.' });
  }
};
