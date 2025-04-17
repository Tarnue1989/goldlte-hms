const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ✅ Configure CORS with origin restriction
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// ✅ Core Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// ✅ Rate limit login attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts. Please try again later.',
});
app.use('/api/auth', authLimiter);

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets/profiles', express.static(path.join(__dirname, 'public/assets/profiles')));
app.use('/assets/resumes', express.static(path.join(__dirname, 'public/assets/resumes')));
app.use('/assets/slides', express.static(path.join(__dirname, 'public/assets/slides')));
app.use('/assets/services', express.static(path.join(__dirname, 'public/assets/services')));
app.use('/assets/videos', express.static(path.join(__dirname, 'public/assets/videos')));
app.use('/assets/logos', express.static(path.join(__dirname, 'public/assets/logos'))); // ✅ added

// ✅ Core API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));

// ✅ Consolidated Home Content Routes
app.use('/api/home-content', require('./routes')); // loads: slides, about, services, etc.

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🌟 Gold LTE HMS API running...');
});

// ✅ Global Error Handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
