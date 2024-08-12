const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { readJsonFromFile, writeJsonToFile } = require('../utils/fileUtils');

const userApiProvidersPath = path.resolve(__dirname, '../data/user_api_providers.json');

const readUserApiProvidersFromFile = () => {
    try {
        logger.info('Reading user API providers from file');
        return readJsonFromFile(userApiProvidersPath);
    } catch (error) {
        logger.error(`Error reading user API providers from file: ${error.message}`);
        throw new Error('Failed to read user API providers');
    }
};

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

const findUserApiProvidersByUserId = (userId) => {
    logger.info('Fetching user API providers by userId', { userId });
    const userApiProviders = readUserApiProvidersFromFile();
    const providers = userApiProviders.filter(provider => provider.userId === userId);
    logger.info('User API providers fetched', { userId, count: providers.length });
    return providers;
};

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
