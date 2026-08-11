const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const db = require('../config/db');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'limon_secret_key_123', {
    expiresIn: '30d'
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (db.isFallback()) {
      const users = db.fallback.getCollection('users');
      // If no admin user exists in fallback, register a default one
      let user = users.find(u => u.username === username);
      if (!user && username === 'admin') {
        const hashedPassword = await bcrypt.hash('password123', 10);
        user = db.fallback.saveToCollection('users', {
          username: 'admin',
          password: hashedPassword
        });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      return res.status(200).json({
        _id: user._id || user.id,
        username: user.username,
        token: generateToken(user._id || user.id)
      });
    }

    // MONGODB PATH
    // Ensure at least one admin exists in MongoDB
    let userCount = await User.countDocuments({});
    if (userCount === 0) {
      // Seed default admin in MongoDB
      const defaultAdmin = new User({
        username: 'admin',
        password: 'password123'
      });
      await defaultAdmin.save();
      console.log('Seeded default admin user in MongoDB (username: admin, password: password123)');
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
});

module.exports = router;
