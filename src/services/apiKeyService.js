const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const apiKeyPath = path.resolve(__dirname, '../data/apiKeys.json');

module.exports = {
  getApiKey(provider) {
    logger.info('Fetching API key', { provider });

    if (!fs.existsSync(apiKeyPath)) {
      logger.warn('apiKeys.json does not exist', { path: apiKeyPath });
      return null;
    }

    try {
      const fileContent = fs.readFileSync(apiKeyPath, 'utf-8');
      logger.info('apiKeys.json content read successfully', { fileContent });
      const apiKeys = JSON.parse(fileContent);
      logger.info('Parsed API Keys', { apiKeys });
      const apiKey = apiKeys[provider] || null;
      if (!apiKey) {
        logger.warn(`API key for provider ${provider} not found`);
      }
      return apiKey;
    } catch (error) {
      logger.error('Error reading or parsing apiKeys.json', { message: error.message });
      return null;
    }
  },

  setApiKey(provider, key) {
    logger.info('Setting API key', { provider });

    let apiKeys = {};
    if (fs.existsSync(apiKeyPath)) {
      try {
        const fileContent = fs.readFileSync(apiKeyPath, 'utf-8');
        logger.info('apiKeys.json content before update', { fileContent });
        apiKeys = JSON.parse(fileContent);
      } catch (error) {
        logger.error('Error reading or parsing apiKeys.json', { message: error.message });
      }
    }

    apiKeys[provider] = key;
    try {
      fs.writeFileSync(apiKeyPath, JSON.stringify(apiKeys, null, 2));
      logger.info('API Key saved successfully', { apiKeys });
    } catch (error) {
      logger.error('Error writing to apiKeys.json', { message: error.message });
    }
  }
};
