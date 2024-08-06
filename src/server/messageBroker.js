// messageBroker.js
const axios = require('axios');
const { getApiKey } = require('./serverApiKeyService');

const messageBroker = async (conversationHistory, provider, model) => {
  try {
    console.log('Fetching API key for provider:', provider);
    const apiKey = getApiKey(provider);
    if (!apiKey) {
      throw new Error(`${provider} API key not found`);
    }
    console.log(`API key retrieved for ${provider}`);

    let url, requestBody, headers;

    if (provider === 'openai') {
      url = 'https://api.openai.com/v1/chat/completions';
      requestBody = {
        model,
        messages: conversationHistory,
        max_tokens: 150,
        temperature: 0.7,
      };
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };
    } else if (provider === 'anthropic') {
      url = 'https://api.anthropic.com/v1/messages';
      const messages = conversationHistory.map(msg => ({
        role: msg.role,
        content: [
          {
            type: 'text',
            text: msg.content
          }
        ]
      }));
      requestBody = {
        model: model,
        max_tokens: 1000,
        temperature: 0,
        messages: messages
      };
      headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      };
    } else {
      throw new Error('Unsupported provider');
    }

    console.log('Sending request to external API:', {
      url,
      requestBody: JSON.stringify(requestBody, null, 2),
      headers,
    });

    const response = await axios.post(url, requestBody, { headers });
    console.log('Received response from external API:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('API response error:', error.response.data);
      return {
        error: {
          type: error.response.data.type,
          message: error.response.data.error.message
        }
      };
    } else {
      console.error('Error communicating with external API:', error.message);
      console.error('Stack trace:', error.stack);
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
