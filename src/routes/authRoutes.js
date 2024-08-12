/**
 * @file authRoutes.js
 * @description Routes for handling user authentication, including login functionality.
 * Each route logs the request before passing control to the respective controller method.
 */

const express = require('express');
const { login } = require('../controllers/authController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route POST /api/login
 * @description Authenticates a user and returns a user ID if successful.
 * @access Public
 */
router.post('/login', (req, res, next) => {
  logger.info('POST /login route hit');
  next();
}, login);

module.exports = router;
