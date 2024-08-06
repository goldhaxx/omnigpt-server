// src/services/apiProviderService.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const providersPath = path.resolve(__dirname, '../data/api_providers.json');

const readApiProvidersFromFile = () => {
  if (!fs.existsSync(providersPath)) {
    fs.writeFileSync(providersPath, JSON.stringify([]));
  }
  const data = fs.readFileSync(providersPath, 'utf-8');
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error parsing JSON data:', error.message);
    return [];
  }
};

const writeApiProvidersToFile = (providers) => {
  fs.writeFileSync(providersPath, JSON.stringify(providers, null, 2));
};

const addApiProvider = (provider) => {
  const providers = readApiProvidersFromFile();
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
    providers[index] = { ...providers[index], ...updates };
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
