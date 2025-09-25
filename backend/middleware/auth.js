const jwt = require('jsonwebtoken');
const { dbHelpers } = require('../database/init');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      requiresAuth: true 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if session exists in database
    const session = dbHelpers.getSessionByToken(token);
    if (!session) {
      return res.status(401).json({ 
        error: 'Invalid or expired session.',
        requiresAuth: true 
      });
    }

    // Update user's last active time
    dbHelpers.updateUserLastActive(decoded.userId);
    
    req.user = {
      id: decoded.userId,
      googleId: session.google_id,
      email: session.email,
      name: session.name,
      picture: session.picture
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ 
      error: 'Invalid token.',
      requiresAuth: true 
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = dbHelpers.getSessionByToken(token);
    
    if (session) {
      dbHelpers.updateUserLastActive(decoded.userId);
      req.user = {
        id: decoded.userId,
        googleId: session.google_id,
        email: session.email,
        name: session.name,
        picture: session.picture
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }

  next();
};

// Middleware to clean up expired sessions
const cleanupExpiredSessions = (req, res, next) => {
  try {
    dbHelpers.deleteExpiredSessions();
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  cleanupExpiredSessions
};