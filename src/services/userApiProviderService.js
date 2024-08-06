// src/services/userApiProviderService.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const userApiProvidersPath = path.resolve(__dirname, '../data/userApiProviders.json');

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

const writeUserApiProvidersToFile = (userApiProviders) => {
  fs.writeFileSync(userApiProvidersPath, JSON.stringify(userApiProviders, null, 2));
};

const addUserApiProvider = (userApiProvider) => {
  const userApiProviders = readUserApiProvidersFromFile();
  const newUserApiProvider = { ...userApiProvider, id: uuidv4() };
  userApiProviders.push(newUserApiProvider);
  writeUserApiProvidersToFile(userApiProviders);
  return newUserApiProvider;
};

const findUserApiProviderById = (id) => {
  const userApiProviders = readUserApiProvidersFromFile();
  return userApiProviders.find(userApiProvider => userApiProvider.id === id);
};

const modifyUserApiProvider = (id, updates) => {
  const userApiProviders = readUserApiProvidersFromFile();
  const index = userApiProviders.findIndex(userApiProvider => userApiProvider.id === id);
  if (index !== -1) {
    userApiProviders[index] = { ...userApiProviders[index], ...updates };
    writeUserApiProvidersToFile(userApiProviders);
    return userApiProviders[index];
  }
  return null;
};

const removeUserApiProvider = (id) => {
  let userApiProviders = readUserApiProvidersFromFile();
  const initialLength = userApiProviders.length;
  userApiProviders = userApiProviders.filter(userApiProvider => userApiProvider.id !== id);
  writeUserApiProvidersToFile(userApiProviders);
  return userApiProviders.length < initialLength;
};

module.exports = {
    addUserApiProvider,
    findUserApiProviderById,
    modifyUserApiProvider,
    removeUserApiProvider,
    readUserApiProvidersFromFile // Ensure this is exported
  };