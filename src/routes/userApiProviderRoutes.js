/**
 * @file userApiProviderRoutes.js
 * @description Routes for managing user-specific API providers, including creating, updating, fetching, and deleting API provider configurations for users.
 * Each route logs the request before passing control to the respective controller method.
 */

const express = require('express');
const {
  createUserApiProvider,
  createNewUserApiProvider,
  getUserApiProvider,
  updateUserApiProvider,
  deleteUserApiProvider,
  getAllUserApiProviders,
  getUserApiProvidersByUserId,
  deleteUserApiProviderByProviderId,
} = require('../controllers/userApiProviderController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route POST /api/user-api-providers
 * @description Creates a new user API provider configuration.
 * @access Public
 */
router.post('/user-api-providers', (req, res, next) => {
  logger.info('POST /user-api-providers route hit');
  next();
}, createUserApiProvider);

/**
 * @route POST /api/user-api-providers/provider/new
 * @description Creates a new API provider configuration for a user, including validation for existing providers.
 * @access Public
 */
router.post('/user-api-providers/provider/new', (req, res, next) => {
  logger.info('POST /user-api-providers/provider/new route hit');
  next();
}, createNewUserApiProvider);

/**
 * @route GET /api/user-api-providers/:id
 * @description Fetches a specific user API provider configuration by its ID.
 * @access Public
 */
router.get('/user-api-providers/:id', (req, res, next) => {
  logger.info(`GET /user-api-providers/:id route hit with ID: ${req.params.id}`);
  next();
}, getUserApiProvider);

/**
 * @route PUT /api/user-api-providers/:id
 * @description Updates the API key of a specific user API provider configuration by its ID.
 * @access Public
 */
router.put('/user-api-providers/:id', (req, res, next) => {
  logger.info(`PUT /user-api-providers/:id route hit with ID: ${req.params.id}`);
  next();
}, updateUserApiProvider);

/**
 * @route DELETE /api/user-api-providers/:id
 * @description Deletes a specific user API provider configuration by its ID.
 * @access Public
 */
router.delete('/user-api-providers/:id', (req, res, next) => {
  logger.info(`DELETE /user-api-providers/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteUserApiProvider);

/**
 * @route DELETE /api/user-api-providers/provider/delete/:id
 * @description Deletes a specific user API provider configuration by the provider's ID.
 * @access Public
 */
router.delete('/user-api-providers/provider/delete/:id', (req, res, next) => {
  logger.info(`DELETE /user-api-providers/provider/delete/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteUserApiProviderByProviderId);

/**
 * @route GET /api/user-api-providers
 * @description Fetches all user API provider configurations.
 * @access Public
 */
router.get('/user-api-providers', (req, res, next) => {
  logger.info('GET /user-api-providers route hit');
  next();
}, getAllUserApiProviders);

/**
 * @route GET /api/user-api-providers/user/:userId
 * @description Fetches all API provider configurations for a specific user by their user ID.
 * @access Public
 */
router.get('/user-api-providers/user/:userId', (req, res, next) => {
  logger.info(`GET /user-api-providers/user/:userId route hit with UserID: ${req.params.userId}`);
  next();
}, getUserApiProvidersByUserId);

module.exports = router;
