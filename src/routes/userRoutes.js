/**
 * @file userRoutes.js
 * @description Routes for managing users, including creating, fetching, updating, and deleting user records.
 * Each route logs the request before passing control to the respective controller method.
 */

const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route POST /api/users
 * @description Creates a new user.
 * @access Public
 */
router.post('/users', (req, res, next) => {
  logger.info('POST /users route hit');
  next();
}, createUser);

/**
 * @route GET /api/users
 * @description Fetches all users.
 * @access Public
 */
router.get('/users', (req, res, next) => {
  logger.info('GET /users route hit');
  next();
}, getUsers);

/**
 * @route GET /api/users/:id
 * @description Fetches a user by their ID.
 * @access Public
 */
router.get('/users/:id', (req, res, next) => {
  logger.info(`GET /users/:id route hit with ID: ${req.params.id}`);
  next();
}, getUserById);

/**
 * @route PUT /api/users/:id
 * @description Updates a user by their ID.
 * @access Public
 */
router.put('/users/:id', (req, res, next) => {
  logger.info(`PUT /users/:id route hit with ID: ${req.params.id}`);
  next();
}, updateUser);

/**
 * @route DELETE /api/users/:id
 * @description Deletes a user by their ID.
 * @access Public
 */
router.delete('/users/:id', (req, res, next) => {
  logger.info(`DELETE /users/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteUser);

module.exports = router;
