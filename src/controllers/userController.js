/**
 * @file userController.js
 * @description Controller for handling user-related operations, including user creation, retrieval,
 * updating, and deletion. Includes input validation using express-validator.
 */

const { check, validationResult } = require('express-validator');
const {
  addUser,
  findUserById,
  modifyUser,
  removeUser,
  readUsersFromFile,
} = require('../services/userService');
const logger = require('../utils/logger');

// Validation rules for creating a user
const validateUserCreation = [
  check('username').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Invalid email format'),
  check('password')
    .isLength({ min: 12 })
    .withMessage('Password must be at least 12 characters long and include uppercase letters, lowercase letters, numbers, and special characters.'),
];

/**
 * Creates a new user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createUser = [
  validateUserCreation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for createUser', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const newUser = await addUser({ username, email, password });
      logger.info('User created successfully', { username, email });
      res.status(201).json(newUser);
    } catch (error) {
      if (error.message === 'Username already exists') {
        logger.warn('Attempted to create a user with an existing username', { username });
        res.status(409).json({ error: 'Username already exists' });
      } else {
        logger.error(`Error creating user: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
];

/**
 * Retrieves all users.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getUsers = (req, res) => {
  logger.info('Fetching all users');
  const users = readUsersFromFile();
  res.json(users);
};

/**
 * Retrieves a user by their ID.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getUserById = (req, res) => {
  const { id } = req.params;
  logger.info(`Fetching user by ID: ${id}`);
  const user = findUserById(id);
  if (user) {
    res.json(user);
  } else {
    logger.warn(`User not found for ID: ${id}`);
    res.status(404).json({ error: 'User not found' });
  }
};

/**
 * Updates a user by their ID.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateUser = [
  check('id').notEmpty().withMessage('User ID is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for updateUser', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;
    logger.info(`Updating user with ID: ${id}`);
    const updatedUser = modifyUser(id, updates);
    if (updatedUser) {
      logger.info('User updated successfully', { id, updates });
      res.json(updatedUser);
    } else {
      logger.warn(`User not found for ID: ${id}`);
      res.status(404).json({ error: 'User not found' });
    }
  }
];

/**
 * Deletes a user by their ID.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteUser = [
  check('id').notEmpty().withMessage('User ID is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for deleteUser', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    logger.info(`Deleting user with ID: ${id}`);
    const success = removeUser(id);
    if (success) {
      logger.info('User deleted successfully', { id });
      res.json({ message: 'User deleted successfully' });
    } else {
      logger.warn(`User not found for ID: ${id}`);
      res.status(404).json({ error: 'User not found' });
    }
  }
];

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
