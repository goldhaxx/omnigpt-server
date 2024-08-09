// src/services/apiProviderService.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const providersPath = path.resolve(__dirname, '../data/api_providers.json');

// Function to read API providers from file
const readApiProvidersFromFile = () => {
  if (!fs.existsSync(providersPath)) {
    fs.writeFileSync(providersPath, JSON.stringify([]));
  }
  try {
    const data = fs.readFileSync(providersPath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    logger.error('Error reading API providers file:', error.message);
    throw error;
  }
};

const writeApiProvidersToFile = (providers) => {
  fs.writeFileSync(providersPath, JSON.stringify(providers, null, 2));
};

const addApiProvider = (provider) => {
  const providers = readApiProvidersFromFile();
  
  if (providers.some(p => p.name === provider.name)) {
    throw new Error('Provider name already exists');
  }
  
  const newProvider = { ...provider, id: uuidv4() };
  providers.push(newProvider);
  writeApiProvidersToFile(providers);
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
    writeApiProvidersToFile(providers);
    return providers[index];
  }
  return null;
};

const removeApiProvider = (id) => {
  let providers = readApiProvidersFromFile();
  const initialLength = providers.length;
  providers = providers.filter(provider => provider.id !== id);
  writeApiProvidersToFile(providers);
  return providers.length < initialLength;
};

module.exports = {
  readApiProvidersFromFile,
  addApiProvider,
  findApiProviderById,
  modifyApiProvider,
  removeApiProvider,
};