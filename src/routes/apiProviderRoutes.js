/**
 * @file apiProviderRoutes.js
 * @description Routes for handling API provider operations, including retrieval, creation, updating, and deletion of API providers. 
 * Each route logs the request before passing control to the respective controller method.
 */

const express = require('express');
const router = express.Router();
const {
  getAllProviders,
  createProvider,
  getProviderById,
  updateProviderById,
  deleteProviderById,
} = require('../controllers/apiProviderController');
const logger = require('../utils/logger');

/**
 * @route GET /api/providers
 * @description Retrieves all API providers.
 * @access Public
 */
router.get('/providers', (req, res, next) => {
  logger.info('GET /providers route hit');
  next();
}, getAllProviders);

/**
 * @route POST /api/providers
 * @description Creates a new API provider.
 * @access Public
 */
router.post('/providers', (req, res, next) => {
  logger.info('POST /providers route hit');
  next();
}, createProvider);

/**
 * @route GET /api/providers/:id
 * @description Retrieves a specific API provider by its ID.
 * @access Public
 */
router.get('/providers/:id', (req, res, next) => {
  logger.info(`GET /providers/:id route hit with ID: ${req.params.id}`);
  next();
}, getProviderById);

/**
 * @route PUT /api/providers/:id
 * @description Updates a specific API provider by its ID.
 * @access Public
 */
router.put('/providers/:id', (req, res, next) => {
  logger.info(`PUT /providers/:id route hit with ID: ${req.params.id}`);
  next();
}, updateProviderById);

/**
 * @route DELETE /api/providers/:id
 * @description Deletes a specific API provider by its ID.
 * @access Public
 */
router.delete('/providers/:id', (req, res, next) => {
  logger.info(`DELETE /providers/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteProviderById);

module.exports = router;
