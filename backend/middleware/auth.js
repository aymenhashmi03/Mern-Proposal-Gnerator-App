const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user to request
    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;

