const fs = require('fs');
const path = require('path');
const axios = require('axios');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Paths to data files
const conversationsPath = path.resolve(__dirname, '../data/conversations.json');
const messagesPath = path.resolve(__dirname, '../data/messages.json');
const apiProvidersPath = path.resolve(__dirname, '../data/api_providers.json');
const userApiProvidersPath = path.resolve(__dirname, '../data/user_api_providers.json');

// Function to read JSON data from a file
const readJsonFromFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    logger.error(`Error reading data from file (${filePath}): ${error.message}`);
    throw error;
  }
};

// Function to write JSON data to a file
const writeJsonToFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    logger.info(`${path.basename(filePath)} written to file successfully.`);
  } catch (error) {
    logger.error(`Error writing data to file (${filePath}): ${error.message}`);
    throw error;
  }
};

// Reading and writing conversations
const readConversationsFromFile = () => readJsonFromFile(conversationsPath);
const writeConversationsToFile = (conversations) => writeJsonToFile(conversationsPath, conversations);

// Reading and writing messages
const readMessagesFromFile = () => readJsonFromFile(messagesPath);
const writeMessagesToFile = (messages) => writeJsonToFile(messagesPath, messages);

// Function to replace placeholders in request bodies and headers
const replacePlaceholders = (template, data) => {
  return JSON.parse(JSON.stringify(template).replace(/{{(.*?)}}/g, (_, key) => data[key]));
};

// Function to find the API provider configuration
const findApiProvider = (providerName, model) => {
  const apiProviders = readJsonFromFile(apiProvidersPath);
  const provider = apiProviders.find(p => p.name === providerName && p.models.includes(model));
  if (!provider) throw new Error(`Provider or model not found for ${providerName} with model ${model}`);
  return provider;
};

// Function to get the user's API key for a given provider
const getUserApiKey = (userId, providerId) => {
  logger.info('getUserApiKey function invoked', { userId, providerId });
  const userApiProviders = readJsonFromFile(userApiProvidersPath);
  const userApiProvider = userApiProviders.find(uap => uap.userId === userId && uap.providerId === providerId);
  if (!userApiProvider) throw new Error('API key not found for the selected provider.');
  return userApiProvider.apiKey;
};

// Function to send a message to an LLM API provider
const sendMessage = async (conversationId, userInput, providerName, model, userId) => {
  try {
    logger.info('sendMessage function invoked', { conversationId, providerName, model, userId });

    const provider = findApiProvider(providerName, model);
    const apiKey = getUserApiKey(userId, provider.id);

    // Replace placeholders in the request body and headers
    const requestBody = replacePlaceholders(provider.requestBody, { model, userInput });
    const headers = replacePlaceholders(provider.headers, { apiKey });

    // Log the request details
    logger.info(`Sending request to ${providerName} API`, {
      url: provider.url,
      headers: headers,
      body: requestBody
    });

    // Send the request to the API
    const response = await axios.post(provider.url, requestBody, { headers });

    // Log the response details
    logger.info(`Received response from ${providerName} API`, {
      status: response.status,
      headers: response.headers,
      body: response.data
    });

    // Extract the message content from the response based on provider
    let responseContent;
    if (providerName === 'openai') {
      responseContent = response.data.choices[0].message.content;
    } else if (providerName === 'anthropic') {
      responseContent = response.data.content[0].text;
    }

    return responseContent;
  } catch (error) {
    logger.error(`Error calling ${providerName} API: ${error.message}`, { conversationId, providerName, model, userId });
    throw error;
  }
};

// Function to add a message to a conversation
const addMessageToConversationService = (conversationId, message) => {
  try {
    const conversations = readConversationsFromFile();
    const conversation = conversations.find(conv => conv.id === conversationId);

    if (conversation) {
      const messages = readMessagesFromFile();
      const newMessage = { id: uuidv4(), conversationId, ...message, timestamp: Date.now() };
      messages.push(newMessage);
      writeMessagesToFile(messages);
      logger.info('Message added to messages file successfully:', newMessage);
      return newMessage;
    } else {
      logger.error(`Conversation with ID ${conversationId} not found`);
      throw new Error('Conversation not found');
    }
  } catch (error) {
    logger.error(`Error in addMessageToConversationService: ${error.message}`);
    throw error;
  }
};

// Function to get all conversations
const getAllConversations = () => {
  try {
    return readConversationsFromFile();
  } catch (error) {
    logger.error(`Failed to fetch conversations: ${error.message}`);
    throw new Error('Failed to fetch conversations');
  }
};

// Function to get messages by conversation ID
const getMessagesByConversationIdService = (conversationId) => {
  try {
    const messages = readMessagesFromFile();
    return messages.filter(msg => msg.conversationId === conversationId);
  } catch (error) {
    logger.error(`Error in getMessagesByConversationIdService: ${error.message}`);
    throw error;
  }
};

module.exports = {
  addMessageToConversationService,
  getAllConversations,
  getMessagesByConversationIdService,
  sendMessage,  // Export the new sendMessage function
};