/**
 * @file authController.js
 * @description Controller for handling user authentication, specifically login functionality.
 */

const { check, validationResult } = require('express-validator');
const { validateUserCredentials } = require('../services/userService');
const logger = require('../utils/logger');

/**
 * Validation rules for login.
 */
const validateLogin = [
  check('username').notEmpty().withMessage('Username is required'),
  check('password').notEmpty().withMessage('Password is required'),
];

/**
 * Handles user login by validating credentials.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const login = [
  validateLogin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for login', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const userId = await validateUserCredentials(username, password);
      if (userId) {
        logger.info('User logged in successfully', { username, userId });
        res.json({ userId });
      } else {
        logger.warn('Invalid credentials for username', { username });
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      logger.error(`Error in login: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

module.exports = { login };
