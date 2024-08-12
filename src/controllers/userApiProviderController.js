const { check, validationResult } = require('express-validator');
const {
  readUserApiProvidersFromFile,
  addUserApiProvider,
  findUserApiProviderById,
  modifyUserApiProvider,
  removeUserApiProvider,
  findUserApiProvidersByUserId,
} = require('../services/userApiProviderService');
const { readApiProvidersFromFile } = require('../services/apiProviderService');
const { readUsersFromFile } = require('../services/userService');
const logger = require('../utils/logger');

// Validation rules
const validateCreateUserApiProvider = [
  check('userId').notEmpty().withMessage('userId is required'),
  check('providerId').notEmpty().withMessage('providerId is required'),
  check('apiKey').notEmpty().withMessage('apiKey is required'),
];

const validateCreateNewUserApiProvider = [
  check('userId').notEmpty().withMessage('userId is required'),
  check('providerName').notEmpty().withMessage('providerName is required'),
  check('providerId').notEmpty().withMessage('providerId is required'),
];

const validateUpdateUserApiProvider = [
  check('apiKey').notEmpty().withMessage('apiKey is required'),
];

// Controller functions with validation

const createUserApiProvider = [
  validateCreateUserApiProvider,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for createUserApiProvider', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, providerId, apiKey } = req.body;

    try {
      const newUserApiProvider = addUserApiProvider({ userId, providerId, apiKey });
      logger.info('User API provider created successfully', { userId, providerId });
      res.status(201).json(newUserApiProvider);
    } catch (error) {
      logger.error(`Error creating user API provider: ${error.message}`);
      if (error.message === 'ProviderId already exists for this userId') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create user API provider' });
    }
  }
];

const createNewUserApiProvider = [
  validateCreateNewUserApiProvider,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for createNewUserApiProvider', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, providerName, providerId, apiKey } = req.body;

    try {
      const users = readUsersFromFile();
      const userExists = users.some((user) => user.id === userId);

      if (!userExists) {
        logger.warn('UserId does not exist');
        return res.status(400).json({ error: 'userId does not exist' });
      }

      const apiProviders = readApiProvidersFromFile();
      const matchingProvider = apiProviders.find(
        (provider) => provider.id === providerId && provider.name === providerName
      );

      if (!matchingProvider) {
        logger.warn('ProviderName or ProviderId does not match');
        return res.status(400).json({ error: 'providerName or providerId does not match any existing provider' });
      }

      const userApiProviders = readUserApiProvidersFromFile();
      const existingProvider = userApiProviders.find(
        (provider) => provider.userId === userId && provider.providerId === providerId
      );

      if (existingProvider) {
        logger.warn('ProviderId already exists for this userId');
        return res.status(400).json({ error: 'ProviderId already exists for this userId. Please delete the existing one before adding a new one.' });
      }

      const newUserApiProvider = addUserApiProvider({ userId, providerId, apiKey });
      logger.info('New user API provider created successfully', { userId, providerId });
      res.status(201).json(newUserApiProvider);
    } catch (error) {
      logger.error(`Error creating new user API provider: ${error.message}`);
      res.status(500).json({ error: 'Failed to create new user API provider' });
    }
  }
];

const getUserApiProvider = (req, res) => {
  const { id } = req.params;
  try {
    const userApiProvider = findUserApiProviderById(id);
    if (userApiProvider) {
      logger.info('User API provider fetched successfully', { id });
      res.json(userApiProvider);
    } else {
      logger.warn('User API provider not found', { id });
      res.status(404).json({ error: 'User API provider not found' });
    }
  } catch (error) {
    logger.error(`Error fetching user API provider: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch user API provider' });
  }
};

const getAllUserApiProviders = (req, res) => {
  try {
    const userApiProviders = readUserApiProvidersFromFile();
    logger.info('All user API providers fetched successfully');
    res.json(userApiProviders);
  } catch (error) {
    logger.error(`Error fetching user API providers: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch user API providers' });
  }
};

const getUserApiProvidersByUserId = (req, res) => {
  const { userId } = req.params;
  try {
    const userApiProviders = findUserApiProvidersByUserId(userId);
    if (userApiProviders.length > 0) {
      logger.info('User API providers fetched successfully for user', { userId });
      res.json(userApiProviders);
    } else {
      logger.warn('User API providers not found for user', { userId });
      res.status(404).json({ error: 'User API providers not found for this user' });
    }
  } catch (error) {
    logger.error(`Error fetching user API providers by userId: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch user API providers by userId' });
  }
};

const updateUserApiProvider = [
  validateUpdateUserApiProvider,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for updateUserApiProvider', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { apiKey } = req.body;

    try {
      const updatedUserApiProvider = modifyUserApiProvider(id, { apiKey });
      if (updatedUserApiProvider) {
        logger.info('User API provider updated successfully', { id });
        res.json(updatedUserApiProvider);
      } else {
        logger.warn('User API provider not found for update', { id });
        res.status(404).json({ error: 'User API provider not found' });
      }
    } catch (error) {
      logger.error(`Error updating user API provider: ${error.message}`);
      res.status(500).json({ error: 'Failed to update user API provider' });
    }
  }
];

const deleteUserApiProvider = (req, res) => {
  const { id } = req.params;
  try {
    const success = removeUserApiProvider(id);
    if (success) {
      logger.info('User API provider deleted successfully', { id });
      res.sendStatus(204);
    } else {
      logger.warn('User API provider not found for deletion', { id });
      res.status(404).json({ error: 'User API provider not found' });
    }
  } catch (error) {
    logger.error(`Error deleting user API provider: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete user API provider' });
  }
};

const deleteUserApiProviderByProviderId = (req, res) => {
  const { id } = req.params;
  try {
    const success = removeUserApiProvider(id);
    if (success) {
      logger.info('User API provider deleted successfully by providerId', { id });
      res.sendStatus(204);
    } else {
      logger.warn('User API provider not found for deletion by providerId', { id });
      res.status(404).json({ error: 'User API provider not found' });
    }
  } catch (error) {
    logger.error(`Error deleting user API provider by providerId: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete user API provider' });
  }
};

module.exports = {
  createUserApiProvider,
  createNewUserApiProvider,
  getUserApiProvider,
  updateUserApiProvider,
  deleteUserApiProvider,
  getAllUserApiProviders,
  getUserApiProvidersByUserId,
  deleteUserApiProviderByProviderId,
};
