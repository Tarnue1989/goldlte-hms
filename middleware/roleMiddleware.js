// middleware/roleMiddleware.js

const roleGuard = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: 'Access denied: No role assigned to user.' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied: Requires one of [${allowedRoles.join(', ')}]`,
        userRole
      });
    }

    next();
  };
};

module.exports = roleGuard;
