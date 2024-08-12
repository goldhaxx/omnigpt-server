/**
 * @file apiProviderService.js
 * @description Service for managing API providers. This service provides functions to read, add, modify, and remove API providers stored in a JSON file.
 */

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { readJsonFromFile, writeJsonToFile } = require('../utils/fileUtils');

const providersPath = path.resolve(__dirname, '../data/api_providers.json');

module.exports = {
  /**
   * @function readApiProvidersFromFile
   * @description Reads the API providers from the api_providers.json file.
   * @returns {Array} An array of API providers.
   * @throws Will throw an error if reading from the file fails.
   */
  readApiProvidersFromFile() {
    try {
      return readJsonFromFile(providersPath);
    } catch (error) {
      logger.error(`Error reading API providers from file: ${error.message}`);
      throw new Error('Failed to read API providers');
    }
  },

  /**
   * @function addApiProvider
   * @description Adds a new API provider to the api_providers.json file.
   * @param {Object} provider - The provider object containing name and models.
   * @returns {Object} The newly added provider with an assigned unique ID.
   * @throws Will throw an error if the provider name already exists.
   */
  addApiProvider(provider) {
    const providers = this.readApiProvidersFromFile();

    if (providers.some((p) => p.name === provider.name)) {
      throw new Error('Provider name already exists');
    }

    const newProvider = { ...provider, id: uuidv4() };
    providers.push(newProvider);
    writeJsonToFile(providersPath, providers);
    return newProvider;
  },

  /**
   * @function findApiProviderById
   * @description Finds an API provider by its ID.
   * @param {string} id - The ID of the provider to find.
   * @returns {Object|null} The found provider, or null if not found.
   */
  findApiProviderById(id) {
    const providers = this.readApiProvidersFromFile();
    return providers.find((provider) => provider.id === id);
  },

  /**
   * @function modifyApiProvider
   * @description Modifies an existing API provider's models by its ID.
   * @param {string} id - The ID of the provider to modify.
   * @param {Object} updates - The updates to apply, specifically the models array.
   * @returns {Object|null} The updated provider, or null if the provider is not found.
   * @throws Will throw an error if attempting to modify the provider's name.
   */
  modifyApiProvider(id, updates) {
    const providers = this.readApiProvidersFromFile();
    const index = providers.findIndex((provider) => provider.id === id);
    if (index !== -1) {
      if (updates.name && updates.name !== providers[index].name) {
        throw new Error('Provider name cannot be modified');
      }
      providers[index] = { ...providers[index], models: updates.models };
      writeJsonToFile(providersPath, providers);
      return providers[index];
    }
    return null;
  },

  /**
   * @function removeApiProvider
   * @description Removes an API provider by its ID.
   * @param {string} id - The ID of the provider to remove.
   * @returns {boolean} True if the provider was removed, false if not found.
   */
  removeApiProvider(id) {
    let providers = this.readApiProvidersFromFile();
    const initialLength = providers.length;
    providers = providers.filter((provider) => provider.id !== id);
    writeJsonToFile(providersPath, providers);
    return providers.length < initialLength;
  }
};
