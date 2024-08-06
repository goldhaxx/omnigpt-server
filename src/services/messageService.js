// src/services/messageService.js
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const conversationsPath = path.resolve(__dirname, '../data/conversations.json');
const messagesPath = path.resolve(__dirname, '../data/messages.json');

// Function to read conversations from file
const readConversationsFromFile = () => {
  try {
    if (!fs.existsSync(conversationsPath)) {
      fs.writeFileSync(conversationsPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(conversationsPath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    logger.error(`Error reading conversations from file: ${error.message}`);
    throw error;
  }
};

// Function to write conversations to file
const writeConversationsToFile = (conversations) => {
  try {
    fs.writeFileSync(conversationsPath, JSON.stringify(conversations, null, 2));
    logger.info('Conversations written to file successfully.');
  } catch (error) {
    logger.error(`Error writing conversations to file: ${error.message}`);
    throw error;
  }
};

// Function to read messages from file
const readMessagesFromFile = () => {
  try {
    if (!fs.existsSync(messagesPath)) {
      fs.writeFileSync(messagesPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(messagesPath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    logger.error(`Error reading messages from file: ${error.message}`);
    throw error;
  }
};

// Function to write messages to file
const writeMessagesToFile = (messages) => {
  try {
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
    logger.info('Messages written to file successfully.');
  } catch (error) {
    logger.error(`Error writing messages to file: ${error.message}`);
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
};
