const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'limon_secret_key_123');
      
      if (db.isFallback()) {
        const users = db.fallback.getCollection('users');
        const user = users.find(u => u._id === decoded.id || u.id === decoded.id);
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, admin user not found in fallback DB' });
        }
        req.user = { id: user._id, username: user.username };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, admin user not found' });
        }
      }
      
      next();
    } catch (error) {
      console.error('JWT authorization error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
