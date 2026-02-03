const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const proposalRoutes = require('./routes/proposals');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proposal Generator API is running' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/proposal-generator';
const PORT = process.env.PORT || 5000;

// Start server even if MongoDB connection fails (for better error messages)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : '❌ NOT SET - This will cause errors!'}`);
  
  // Connect to MongoDB
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('⚠️  Make sure MongoDB is running on:', MONGODB_URI);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

