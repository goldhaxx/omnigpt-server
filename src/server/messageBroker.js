const axios = require('axios');
const { getUserApiKey } = require('../services/userApiProviderService');
const { getProviderDetails } = require('../services/apiProviderService');
const logger = require('../utils/logger');

const messageBroker = async (conversationHistory, userId, provider, model) => {
  try {
    logger.info(`Fetching API key for provider: ${provider}`);
    const apiKey = getUserApiKey(userId, provider);
    if (!apiKey) {
      throw new Error(`${provider} API key not found for user ${userId}`);
    }
    logger.info(`API key retrieved for ${provider}`);

    const providerDetails = getProviderDetails(provider);
    if (!providerDetails) {
      throw new Error(`Provider details not found for ${provider}`);
    }

    let url = providerDetails.messageUrl;
    let requestBody = {
      model,
      messages: conversationHistory,
      ...providerDetails.requiredParams,
    };
    let headers = {
      'Content-Type': 'application/json',
      ...providerDetails.headers,
      'Authorization': `Bearer ${apiKey}`,
    };

    if (provider === 'anthropic') {
      requestBody.messages = conversationHistory.map(msg => ({
        role: msg.role,
        content: [
          {
            type: 'text',
            text: msg.content
          }
        ]
      }));
      headers['x-api-key'] = apiKey;
    }

    logger.info('Sending request to external API', {
      url,
      requestBody: JSON.stringify(requestBody, null, 2),
      headers,
    });

    const response = await axios.post(url, requestBody, { headers });
    logger.info('Received response from external API', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      logger.error('API response error:', error.response.data);
      return {
        error: {
          type: error.response.data.type,
          message: error.response.data.error.message
        }
      };
    } else {
      logger.error('Error communicating with external API:', error.message);
      logger.error('Stack trace:', error.stack);
      return {
        error: {
          type: 'internal_error',
          message: error.message
        }
      };
    }
  }
};

module.exports = messageBroker;
