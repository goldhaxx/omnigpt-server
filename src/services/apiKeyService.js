// serverApiKeyService.js
const fs = require('fs');
const path = require('path');

const apiKeyPath = path.resolve(__dirname, '../data/apiKeys.json');

module.exports = {
  getApiKey(provider) {
    console.log('apiKeyPath:', apiKeyPath);

    if (!fs.existsSync(apiKeyPath)) {
      console.log('apiKeys.json does not exist');
      return null;
    }

    try {
      const fileContent = fs.readFileSync(apiKeyPath, 'utf-8');
      console.log('apiKeys.json content:', fileContent);
      const apiKeys = JSON.parse(fileContent);
      console.log('Retrieved API Keys:', apiKeys);
      const apiKey = apiKeys[provider] || null;
      if (!apiKey) {
        console.log(`API key for provider ${provider} not found`);
      }
      return apiKey;
    } catch (error) {
      console.error('Error reading or parsing apiKeys.json:', error);
      return null;
    }
  },

  setApiKey(provider, key) {
    let apiKeys = {};
    if (fs.existsSync(apiKeyPath)) {
      try {
        const fileContent = fs.readFileSync(apiKeyPath, 'utf-8');
        console.log('apiKeys.json content before update:', fileContent);
        apiKeys = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error reading or parsing apiKeys.json:', error);
      }
    }
    apiKeys[provider] = key;
    try {
      fs.writeFileSync(apiKeyPath, JSON.stringify(apiKeys, null, 2));
      console.log('Saved API Key:', apiKeys);
    } catch (error) {
      console.error('Error writing to apiKeys.json:', error);
    }
  }
};
