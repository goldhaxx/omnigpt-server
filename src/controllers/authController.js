// src/controllers/authController.js
const { validateUserCredentials } = require('../services/userService');
const logger = require('../utils/logger');

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    logger.warn('Username and password are required in login');
    return res.status(400).json({ error: 'Username and password are required' });
  }
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
};

module.exports = { login };
