/**
 * @file userApiProviderService.js
 * @description Service for managing user API providers. This service includes functions for adding, modifying, and removing user API provider configurations.
 */

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { readJsonFromFile, writeJsonToFile } = require('../utils/fileUtils');

const userApiProvidersPath = path.resolve(__dirname, '../data/user_api_providers.json');

/**
 * Reads all user API providers from the JSON file.
 * @returns {Array} An array of user API providers.
 * @throws Will throw an error if reading the file fails.
 */
const readUserApiProvidersFromFile = () => {
    try {
        logger.info('Reading user API providers from file');
        return readJsonFromFile(userApiProvidersPath);
    } catch (error) {
        logger.error(`Error reading user API providers from file: ${error.message}`);
        throw new Error('Failed to read user API providers');
    }
};

/**
 * Adds a new user API provider.
 * @param {Object} userApiProvider - The user API provider object to add.
 * @returns {Object} The newly added user API provider.
 * @throws Will throw an error if a provider with the same userId and providerId already exists.
 */
const addUserApiProvider = (userApiProvider) => {
    try {
        logger.info('Attempting to add a new user API provider', { userApiProvider });
        
        const userApiProviders = readUserApiProvidersFromFile();
        logger.info('Existing user API providers loaded', { userApiProviders });

        const existingProvider = userApiProviders.find(provider =>
            provider.userId === userApiProvider.userId && provider.providerId === userApiProvider.providerId
        );

        if (existingProvider) {
            const errorMsg = 'ProviderId already exists for this userId';
            logger.warn(errorMsg, { userId: userApiProvider.userId, providerId: userApiProvider.providerId });
            throw new Error(errorMsg);
        }

        const newUserApiProvider = { ...userApiProvider, id: uuidv4() };
        userApiProviders.push(newUserApiProvider);
        writeJsonToFile(userApiProvidersPath, userApiProviders);
        logger.info('User API provider added successfully', { newUserApiProvider });

        return newUserApiProvider;
    } catch (error) {
        logger.error(`Failed to add user API provider: ${error.message}`, { userApiProvider });
        throw new Error('Failed to add user API provider');
    }
};

/**
 * Finds user API providers by user ID.
 * @param {string} userId - The user ID to search for.
 * @returns {Array} An array of user API providers for the given user ID.
 */
const findUserApiProvidersByUserId = (userId) => {
    logger.info('Fetching user API providers by userId', { userId });
    const userApiProviders = readUserApiProvidersFromFile();
    const providers = userApiProviders.filter(provider => provider.userId === userId);
    logger.info('User API providers fetched', { userId, count: providers.length });
    return providers;
};

/**
 * Finds a user API provider by its ID.
 * @param {string} id - The ID of the user API provider.
 * @returns {Object|null} The user API provider if found, otherwise null.
 */
const findUserApiProviderById = (id) => {
    logger.info('Fetching user API provider by id', { id });
    const userApiProviders = readUserApiProvidersFromFile();
    const provider = userApiProviders.find(provider => provider.id === id);
    if (provider) {
        logger.info('User API provider found', { provider });
    } else {
        logger.warn('No provider found for id', { id });
    }
    return provider;
};

/**
 * Modifies an existing user API provider.
 * @param {string} id - The ID of the user API provider to modify.
 * @param {Object} updates - The updates to apply.
 * @returns {Object|null} The updated user API provider if found, otherwise null.
 * @throws Will throw an error if modifying the provider fails.
 */
const modifyUserApiProvider = (id, updates) => {
    try {
        logger.info('Attempting to modify user API provider by id', { id, updates });
        const userApiProviders = readUserApiProvidersFromFile();
        const index = userApiProviders.findIndex(provider => provider.id === id);

        if (index === -1) {
            logger.warn('No provider found to update for id', { id });
            return null;
        }

        userApiProviders[index] = { ...userApiProviders[index], ...updates };
        writeJsonToFile(userApiProvidersPath, userApiProviders);
        logger.info('User API provider modified successfully', { updatedProvider: userApiProviders[index] });
        return userApiProviders[index];
    } catch (error) {
        logger.error(`Failed to modify user API provider: ${error.message}`, { id, updates });
        throw new Error('Failed to modify user API provider');
    }
};

/**
 * Removes a user API provider by its ID.
 * @param {string} id - The ID of the user API provider to remove.
 * @returns {boolean} True if the provider was removed, false if not found.
 * @throws Will throw an error if removing the provider fails.
 */
const removeUserApiProvider = (id) => {
    try {
        logger.info('Attempting to remove user API provider by id', { id });
        let userApiProviders = readUserApiProvidersFromFile();
        const initialLength = userApiProviders.length;
        userApiProviders = userApiProviders.filter(provider => provider.id !== id);
        writeJsonToFile(userApiProvidersPath, userApiProviders);
        const success = userApiProviders.length < initialLength;
        if (success) {
            logger.info('User API provider removed successfully', { id });
        } else {
            logger.warn('No provider removed, ID not found', { id });
        }
        return success;
    } catch (error) {
        logger.error(`Failed to remove user API provider: ${error.message}`, { id });
        throw new Error('Failed to remove user API provider');
    }
};

module.exports = {
    addUserApiProvider,
    findUserApiProvidersByUserId,
    findUserApiProviderById,
    modifyUserApiProvider,
    removeUserApiProvider,
    readUserApiProvidersFromFile,
};
