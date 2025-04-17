const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.Role?.role_name || 'Unknown',
      role_id: user.role_id,
      department_id: user.department_id || null
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET, // ✅ use consistent name
    { expiresIn: '7d' }
  );
};
