const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { dbHelpers } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper function to create session in database
const createUserSession = (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + parseInt(process.env.SESSION_DURATION_HOURS || 168)); // 7 days default
  
  dbHelpers.createSession(userId, token, expiresAt.toISOString());
  return expiresAt;
};

// POST /auth/google - Verify Google token and authenticate user
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential token is required' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!googleId || !email) {
      return res.status(400).json({ error: 'Invalid Google token payload' });
    }

    // Check if user exists in database
    let user = dbHelpers.getUserByGoogleId(googleId);

    if (!user) {
      // Create new user
      const result = dbHelpers.createUser(googleId, email, name, picture);
      user = dbHelpers.getUserById(result.lastInsertRowid);
      console.log('New user created:', { id: user.id, email: user.email, name: user.name });
    } else {
      // Update user's last active time
      dbHelpers.updateUserLastActive(user.id);
      console.log('Existing user authenticated:', { id: user.id, email: user.email, name: user.name });
    }

    // Generate JWT token
    const token = generateToken(user.id);
    
    // Create session in database
    const expiresAt = createUserSession(user.id, token);

    res.json({
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: user.id,
        googleId: user.google_id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });

  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
});

// GET /auth/me - Get current user info
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// POST /auth/logout - Logout user (invalidate session)
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      dbHelpers.deleteSession(token);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Logout failed',
      details: error.message 
    });
  }
});

// GET /auth/stats - Get authentication statistics
router.get('/stats', (req, res) => {
  try {
    const stats = dbHelpers.getVotingStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting auth stats:', error);
    res.status(500).json({ 
      error: 'Failed to get statistics',
      details: error.message 
    });
  }
});

module.exports = router;