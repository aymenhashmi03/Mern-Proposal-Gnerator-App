const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: errors.array()[0].msg,
          errors: errors.array() 
        });
      }

      const { fullName, email, password, role } = req.body;

      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB not connected. ReadyState:', mongoose.connection.readyState);
        return res.status(500).json({ error: 'Database connection error. Please check if MongoDB is running.' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Create new user
      const user = new User({
        fullName,
        email,
        password,
        role: role || 'Freelancer'
      });

      await user.save();

      // Check if JWT_SECRET is set
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not set in environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ 
        error: 'Server error during registration',
        message: error.message 
      });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: errors.array()[0].msg,
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;

      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB not connected. ReadyState:', mongoose.connection.readyState);
        return res.status(500).json({ error: 'Database connection error. Please check if MongoDB is running.' });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if JWT_SECRET is set
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not set in environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Server error during login',
        message: error.message 
      });
    }
  }
);

// Verify token and get user
router.get('/verify', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

