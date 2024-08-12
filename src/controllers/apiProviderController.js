/**
 * @file apiProviderController.js
 * @description Controller for managing API providers, including creating, updating, fetching, and deleting providers.
 */

const { check, validationResult } = require('express-validator');
const {
  readApiProvidersFromFile,
  addApiProvider,
  findApiProviderById,
  modifyApiProvider,
  removeApiProvider,
} = require('../services/apiProviderService');
const logger = require('../utils/logger');

/**
 * Validation rules for creating a provider.
 */
const validateProviderCreation = [
  check('name').notEmpty().withMessage('Provider name is required'),
  check('models').isArray({ min: 1 }).withMessage('Models must be an array with at least one model'),
];

/**
 * Fetches all API providers.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllProviders = (req, res) => {
  logger.info('Fetching all API providers');
  const providers = readApiProvidersFromFile();
  res.json(providers);
};

/**
 * Creates a new API provider.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createProvider = [
  validateProviderCreation,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for createProvider', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, models } = req.body;

    try {
      const newProvider = addApiProvider({ name, models });
      logger.info(`Provider created: ${newProvider.name}`);
      res.status(201).json(newProvider);
    } catch (error) {
      logger.error(`Error creating provider: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
];

/**
 * Fetches an API provider by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getProviderById = (req, res) => {
  logger.info(`Fetching provider by ID: ${req.params.id}`);
  const provider = findApiProviderById(req.params.id);
  if (provider) {
    res.json(provider);
  } else {
    logger.warn(`Provider not found for ID: ${req.params.id}`);
    res.status(404).json({ error: 'Provider not found' });
  }
};

/**
 * Updates an API provider by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateProviderById = [
  check('models').isArray({ min: 1 }).withMessage('Models must be an array with at least one model'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for updateProviderById', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { models } = req.body;

    try {
      const updatedProvider = modifyApiProvider(req.params.id, { models });
      if (updatedProvider) {
        logger.info(`Provider updated: ${req.params.id}`);
        res.json(updatedProvider);
      } else {
        logger.warn(`Provider not found for update: ${req.params.id}`);
        res.status(404).json({ error: 'Provider not found' });
      }
    } catch (error) {
      logger.error(`Error updating provider: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
];

/**
 * Deletes an API provider by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteProviderById = (req, res) => {
  logger.info(`Attempting to delete provider with ID: ${req.params.id}`);
  const success = removeApiProvider(req.params.id);
  if (success) {
    logger.info(`Provider deleted: ${req.params.id}`);
    res.sendStatus(204);
  } else {
    logger.warn(`Provider not found for deletion: ${req.params.id}`);
    res.status(404).json({ error: 'Provider not found' });
  }
};

module.exports = {
  getAllProviders,
  createProvider,
  getProviderById,
  updateProviderById,
  deleteProviderById,
};
