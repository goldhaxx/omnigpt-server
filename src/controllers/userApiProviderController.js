const {
  readUserApiProvidersFromFile,
  addUserApiProvider,
  findUserApiProviderById,
  modifyUserApiProvider,
  removeUserApiProvider,
  findUserApiProvidersByUserId
} = require('../services/userApiProviderService');
const { readApiProvidersFromFile } = require('../services/apiProviderService');
const { readUsersFromFile } = require('../services/userService'); // Ensure this function is imported
const logger = require('../utils/logger');

const createUserApiProvider = (req, res) => {
  const { userId, providerId, apiKey } = req.body;
  if (!userId || !providerId || !apiKey) {
    logger.warn('Missing required fields in createUserApiProvider');
    return res.status(400).json({ error: 'userId, providerId, and apiKey are required' });
  }
  try {
    const newUserApiProvider = addUserApiProvider({ userId, providerId, apiKey });
    res.status(201).json(newUserApiProvider);
  } catch (error) {
    logger.error(`Error creating user API provider: ${error.message}`);
    if (error.message === 'ProviderId already exists for this userId') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create user API provider' });
  }
};

const createNewUserApiProvider = (req, res) => {
  const { userId, providerName, providerId, apiKey } = req.body;
  if (!userId || !providerName || !providerId) {
    logger.warn('Missing required fields in createNewUserApiProvider');
    return res.status(400).json({ error: 'userId, providerName, and providerId are required' });
  }

  try {
    const users = readUsersFromFile();
    const userExists = users.some(user => user.id === userId);

    if (!userExists) {
      logger.warn('UserId does not exist');
      return res.status(400).json({ error: 'userId does not exist' });
    }

    const apiProviders = readApiProvidersFromFile();
    const matchingProvider = apiProviders.find(provider => provider.id === providerId && provider.name === providerName);

    if (!matchingProvider) {
      logger.warn('ProviderName or ProviderId does not match');
      return res.status(400).json({ error: 'providerName or providerId does not match any existing provider' });
    }

    const userApiProviders = readUserApiProvidersFromFile();
    const existingProvider = userApiProviders.find(provider => provider.userId === userId && provider.providerId === providerId);

    if (existingProvider) {
      logger.warn('ProviderId already exists for this userId');
      return res.status(400).json({ error: 'ProviderId already exists for this userId. Please delete the existing one before adding a new one.' });
    }

    const newUserApiProvider = addUserApiProvider({ userId, providerId, apiKey });
    res.status(201).json(newUserApiProvider);
  } catch (error) {
    logger.error(`Error creating new user API provider: ${error.message}`);
    res.status(500).json({ error: 'Failed to create new user API provider' });
  }
};

const getUserApiProvider = (req, res) => {
  const { id } = req.params;
  try {
    const userApiProvider = findUserApiProviderById(id);
    if (userApiProvider) {
      res.json(userApiProvider);
    } else {
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
      res.json(userApiProviders);
    } else {
      res.status(404).json({ error: 'User API providers not found for this user' });
    }
  } catch (error) {
    logger.error(`Error fetching user API providers by userId: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch user API providers by userId' });
  }
};

const updateUserApiProvider = (req, res) => {
  const { id } = req.params;
  const { apiKey, ...otherFields } = req.body;

  if (Object.keys(otherFields).length > 0) {
    logger.warn('Attempt to update fields other than apiKey in updateUserApiProvider');
    return res.status(400).json({ error: 'Only apiKey can be updated' });
  }

  if (!apiKey) {
    logger.warn('Missing apiKey in updateUserApiProvider');
    return res.status(400).json({ error: 'apiKey is required' });
  }

  try {
    const updatedUserApiProvider = modifyUserApiProvider(id, { apiKey });
    if (updatedUserApiProvider) {
      res.json(updatedUserApiProvider);
    } else {
      res.status(404).json({ error: 'User API provider not found' });
    }
  } catch (error) {
    logger.error(`Error updating user API provider: ${error.message}`);
    res.status(500).json({ error: 'Failed to update user API provider' });
  }
};

const deleteUserApiProvider = (req, res) => {
  const { id } = req.params;
  try {
    const success = removeUserApiProvider(id);
    if (success) {
      res.sendStatus(204);
    } else {
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
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'User API provider not found' });
    }
  } catch (error) {
    logger.error(`Error deleting user API provider: ${error.message}`);
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
  deleteUserApiProviderByProviderId
};
