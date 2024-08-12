/**
 * @file messageService.js
 * @description Service for managing messages and conversations. This service includes functions for sending messages to LLM APIs, storing messages, and managing conversations.
 */

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

/**
 * Reads JSON data from a file.
 * @param {string} filePath - The path to the file.
 * @returns {Object|Array} The parsed JSON data from the file.
 * @throws Will throw an error if the file cannot be read or parsed.
 */
const readJsonFromFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      logger.info(`${path.basename(filePath)} created as it did not exist.`);
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    logger.error(`Error reading data from file (${filePath}): ${error.message}`);
    throw error;
  }
};

/**
 * Writes JSON data to a file.
 * @param {string} filePath - The path to the file.
 * @param {Object|Array} data - The JSON data to write.
 * @throws Will throw an error if the file cannot be written.
 */
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

/**
 * Replaces placeholders in a template with provided data.
 * @param {Object} template - The template object with placeholders.
 * @param {Object} data - The data to replace placeholders.
 * @returns {Object} The template with placeholders replaced.
 */
const replacePlaceholders = (template, data) => {
  return JSON.parse(JSON.stringify(template).replace(/{{(.*?)}}/g, (_, key) => data[key]));
};

/**
 * Finds the API provider configuration based on the provider name and model.
 * @param {string} providerName - The name of the API provider.
 * @param {string} model - The model to use.
 * @returns {Object} The configuration of the API provider.
 * @throws Will throw an error if the provider or model is not found.
 */
const findApiProvider = (providerName, model) => {
  logger.info('Finding API provider configuration', { providerName, model });
  const apiProviders = readJsonFromFile(apiProvidersPath);
  const provider = apiProviders.find(p => p.name === providerName && p.models.includes(model));
  if (!provider) {
    logger.error(`Provider or model not found for ${providerName} with model ${model}`);
    throw new Error(`Provider or model not found for ${providerName} with model ${model}`);
  }
  return provider;
};

/**
 * Retrieves the user's API key for a given provider.
 * @param {string} userId - The user's ID.
 * @param {string} providerId - The provider's ID.
 * @returns {string} The API key for the provider.
 * @throws Will throw an error if the API key is not found.
 */
const getUserApiKey = (userId, providerId) => {
  logger.info('Retrieving user API key', { userId, providerId });
  const userApiProviders = readJsonFromFile(userApiProvidersPath);
  const userApiProvider = userApiProviders.find(uap => uap.userId === userId && uap.providerId === providerId);
  if (!userApiProvider) {
    logger.error('API key not found for the selected provider', { userId, providerId });
    throw new Error('API key not found for the selected provider.');
  }
  return userApiProvider.apiKey;
};

/**
 * Sends a message to an LLM API provider and returns the response.
 * @param {string} conversationId - The ID of the conversation.
 * @param {string} userInput - The user's input message.
 * @param {string} providerName - The name of the API provider.
 * @param {string} model - The model to use.
 * @param {string} userId - The user's ID.
 * @returns {string} The response from the API provider.
 * @throws Will throw an error if the API request fails.
 */
const sendMessage = async (conversationId, userInput, providerName, model, userId) => {
  try {
    logger.info('Sending message to LLM API provider', { conversationId, providerName, model, userId });

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

/**
 * Adds a message to a conversation.
 * @param {string} conversationId - The ID of the conversation.
 * @param {Object} message - The message object containing content, role, provider, model, and timestamp.
 * @returns {Object} The newly added message.
 * @throws Will throw an error if the conversation is not found or the message cannot be added.
 */
const addMessageToConversationService = (conversationId, message) => {
  try {
    logger.info('Adding message to conversation', { conversationId, message });
    const conversations = readConversationsFromFile();
    const conversation = conversations.find(conv => conv.id === conversationId);

    if (conversation) {
      const messages = readMessagesFromFile();
      const newMessage = { id: uuidv4(), conversationId, ...message, timestamp: Date.now() };
      messages.push(newMessage);
      writeMessagesToFile(messages);
      logger.info('Message added to messages file successfully', { newMessage });
      return newMessage;
    } else {
      logger.error(`Conversation with ID ${conversationId} not found`);
      throw new Error('Conversation not found');
    }
  } catch (error) {
    logger.error(`Error in addMessageToConversationService: ${error.message}`, { conversationId, message });
    throw error;
  }
};

/**
 * Retrieves all conversations.
 * @returns {Array} An array of all conversations.
 * @throws Will throw an error if fetching the conversations fails.
 */
const getAllConversations = () => {
  try {
    logger.info('Fetching all conversations');
    const conversations = readConversationsFromFile();
    logger.info('Conversations fetched successfully', { count: conversations.length });
    return conversations;
  } catch (error) {
    logger.error(`Failed to fetch conversations: ${error.message}`);
    throw new Error('Failed to fetch conversations');
  }
};

/**
 * Retrieves messages by conversation ID.
 * @param {string} conversationId - The ID of the conversation.
 * @returns {Array} An array of messages for the specified conversation.
 * @throws Will throw an error if fetching the messages fails.
 */
const getMessagesByConversationIdService = (conversationId) => {
  try {
    logger.info('Fetching messages by conversation ID', { conversationId });
    const messages = readMessagesFromFile();
    const conversationMessages = messages.filter(msg => msg.conversationId === conversationId);
    logger.info('Messages fetched successfully', { conversationId, count: conversationMessages.length });
    return conversationMessages;
  } catch (error) {
    logger.error(`Error in getMessagesByConversationIdService: ${error.message}`, { conversationId });
    throw error;
  }
};

module.exports = {
  addMessageToConversationService,
  getAllConversations,
  getMessagesByConversationIdService,
  sendMessage,
};
