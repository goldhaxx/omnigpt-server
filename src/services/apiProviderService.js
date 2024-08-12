const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { readJsonFromFile, writeJsonToFile } = require('../utils/fileUtils');

const providersPath = path.resolve(__dirname, '../data/api_providers.json');

const readApiProvidersFromFile = () => {
    try {
        return readJsonFromFile(providersPath);
    } catch (error) {
        logger.error(`Error reading API providers from file: ${error.message}`);
        throw new Error('Failed to read API providers');
    }
};

const addApiProvider = (provider) => {
    const providers = readApiProvidersFromFile();

    if (providers.some(p => p.name === provider.name)) {
        throw new Error('Provider name already exists');
    }

    const newProvider = { ...provider, id: uuidv4() };
    providers.push(newProvider);
    writeJsonToFile(providersPath, providers);
    return newProvider;
};

const findApiProviderById = (id) => {
    const providers = readApiProvidersFromFile();
    return providers.find(provider => provider.id === id);
};

const modifyApiProvider = (id, updates) => {
    const providers = readApiProvidersFromFile();
    const index = providers.findIndex(provider => provider.id === id);
    if (index !== -1) {
        if (updates.name && updates.name !== providers[index].name) {
            throw new Error('Provider name cannot be modified');
        }
        providers[index] = { ...providers[index], models: updates.models };
        writeJsonToFile(providersPath, providers);
        return providers[index];
    }
    return null;
};

const removeApiProvider = (id) => {
    let providers = readApiProvidersFromFile();
    const initialLength = providers.length;
    providers = providers.filter(provider => provider.id !== id);
    writeJsonToFile(providersPath, providers);
    return providers.length < initialLength;
};

module.exports = {
    addApiProvider,
    findApiProviderById,
    modifyApiProvider,
    removeApiProvider,
    readApiProvidersFromFile // Ensure this is exported
};
