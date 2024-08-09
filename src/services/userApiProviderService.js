// src/services/userApiProviderService.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { readApiProvidersFromFile } = require('./apiProviderService');

const userApiProvidersPath = path.resolve(__dirname, '../data/user_api_providers.json');

// Function to read user API providers from file
const readUserApiProvidersFromFile = () => {
  if (!fs.existsSync(userApiProvidersPath)) {
    fs.writeFileSync(userApiProvidersPath, JSON.stringify([]));
  }

  try {
    const data = fs.readFileSync(userApiProvidersPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      logger.error('Syntax error while parsing JSON data:', error.message);
    } else {
      logger.error('Error reading JSON data:', error.message);
    }
    return [];
  }
};

// Function to write user API providers to file
const writeUserApiProvidersToFile = (userApiProviders) => {
  try {
    fs.writeFileSync(userApiProvidersPath, JSON.stringify(userApiProviders, null, 2));
    logger.info('User API providers written to file successfully.');
  } catch (error) {
    logger.error(`Error writing user API providers to file: ${error.message}`);
    throw error;
  }
};

// Function to add a user API provider
const addUserApiProvider = (userApiProvider) => {
  try {
    const userApiProviders = readUserApiProvidersFromFile();

    // Check if providerId is unique for the given userId
    const existingProvider = userApiProviders.find(provider =>
      provider.userId === userApiProvider.userId && provider.providerId === userApiProvider.providerId
    );

    if (existingProvider) {
      const errorMsg = 'ProviderId already exists for this userId';
      logger.warn(errorMsg);
      throw new Error(errorMsg);
    }

    const newUserApiProvider = { ...userApiProvider, id: uuidv4() };
    userApiProviders.push(newUserApiProvider);
    writeUserApiProvidersToFile(userApiProviders);
    logger.info('User API provider added successfully:', newUserApiProvider);
    return newUserApiProvider;
  } catch (error) {
    logger.error(`Error adding user API provider: ${error.message}`);
    throw error;
  }
};

// Function to find a user API provider by ID
const findUserApiProviderById = (id) => {
  try {
    const userApiProviders = readUserApiProvidersFromFile();
    return userApiProviders.find(provider => provider.id === id);
  } catch (error) {
    logger.error(`Error finding user API provider by ID: ${error.message}`);
    throw error;
  }
};

// Function to find user API providers by user ID
const findUserApiProvidersByUserId = (userId) => {
  try {
    const userApiProviders = readUserApiProvidersFromFile();
    const apiProviders = readApiProvidersFromFile();

    return userApiProviders
      .filter(provider => provider.userId === userId)
      .map(provider => {
        const apiProviderDetails = apiProviders.find(apiProvider => apiProvider.id === provider.providerId);
        return {
          userApiProviderId: provider.id,
          apiProviderId: provider.providerId,
          providerApiKey: provider.apiKey,
          providerName: apiProviderDetails?.name || 'Unknown Provider',
          providerModels: apiProviderDetails?.models || []
        };
      });
  } catch (error) {
    logger.error(`Error finding user API providers by user ID: ${error.message}`);
    throw error;
  }
};

// Function to modify a user API provider
const modifyUserApiProvider = (id, updates) => {
  try {
    const userApiProviders = readUserApiProvidersFromFile();
    const index = userApiProviders.findIndex(provider => provider.id === id);
    if (index !== -1) {
      userApiProviders[index] = { ...userApiProviders[index], ...updates };
      writeUserApiProvidersToFile(userApiProviders);
      logger.info('User API provider updated successfully:', userApiProviders[index]);
      return userApiProviders[index];
    }
    return null;
  } catch (error) {
    logger.error(`Error modifying user API provider: ${error.message}`);
    throw error;
  }
};

// Function to remove a user API provider
const removeUserApiProvider = (id) => {
  try {
    let userApiProviders = readUserApiProvidersFromFile();
    const initialLength = userApiProviders.length;
    userApiProviders = userApiProviders.filter(provider => provider.id !== id);
    writeUserApiProvidersToFile(userApiProviders);
    const success = userApiProviders.length < initialLength;
    logger.info(`User API provider removal status: ${success}`);
    return success;
  } catch (error) {
    logger.error(`Error removing user API provider: ${error.message}`);
    throw error;
  }
};

module.exports = {
  readUserApiProvidersFromFile,
  addUserApiProvider,
  findUserApiProviderById,
  findUserApiProvidersByUserId,
  modifyUserApiProvider,
  removeUserApiProvider,
};
