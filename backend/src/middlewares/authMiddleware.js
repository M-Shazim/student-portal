// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  console.log(JWT_SECRET);
  if (!token) return res.status(401).json({ message: 'Access denied: No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Accepts a single role or an array of allowed roles
exports.requireRole = (roles) => (req, res, next) => {
  const userRole = req.user?.role;

  // Convert to array if a single role is passed
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
  }

  next();
};

