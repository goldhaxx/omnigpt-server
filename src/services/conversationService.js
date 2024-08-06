// src/services/conversationService.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const conversationsPath = path.resolve(__dirname, '../data/conversations.json');

// Function to read conversations from file
const readConversationsFromFile = () => {
  try {
    if (!fs.existsSync(conversationsPath)) {
      fs.writeFileSync(conversationsPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(conversationsPath, 'utf-8');
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Error reading conversations from file: ${error.message}`);
    throw new Error('Failed to read conversations from file');
  }
};

// Function to write conversations to file
const writeConversationsToFile = (conversations) => {
  try {
    fs.writeFileSync(conversationsPath, JSON.stringify(conversations, null, 2));
    logger.info('Conversations written to file successfully.');
  } catch (error) {
    logger.error(`Error writing conversations to file: ${error.message}`);
    throw new Error('Failed to write conversations to file');
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

// Function to add a conversation
const addConversation = (conversation) => {
  try {
    const conversations = readConversationsFromFile();
    const newConversation = { ...conversation, id: uuidv4(), timestamp: Date.now() };
    conversations.push(newConversation);
    writeConversationsToFile(conversations);
    logger.info('Conversation added successfully:', newConversation);
    return newConversation;
  } catch (error) {
    logger.error(`Error adding conversation: ${error.message}`);
    throw new Error('Failed to add conversation');
  }
};

// Function to find a conversation by ID
const findConversationById = (id) => {
  try {
    const conversations = readConversationsFromFile();
    return conversations.find(conversation => conversation.id === id);
  } catch (error) {
    logger.error(`Error finding conversation by ID: ${error.message}`);
    throw new Error('Failed to find conversation by ID');
  }
};

// Function to modify a conversation
const modifyConversation = (id, updates) => {
  try {
    const conversations = readConversationsFromFile();
    const index = conversations.findIndex(conversation => conversation.id === id);
    if (index !== -1) {
      conversations[index] = { ...conversations[index], ...updates };
      writeConversationsToFile(conversations);
      logger.info('Conversation updated successfully:', conversations[index]);
      return conversations[index];
    }
    return null;
  } catch (error) {
    logger.error(`Error modifying conversation: ${error.message}`);
    throw new Error('Failed to modify conversation');
  }
};

// Function to remove a conversation
const removeConversation = (id) => {
  try {
    let conversations = readConversationsFromFile();
    const initialLength = conversations.length;
    conversations = conversations.filter(conversation => conversation.id !== id);
    writeConversationsToFile(conversations);
    const success = conversations.length < initialLength;
    logger.info(`Conversation removal status: ${success}`);
    return success;
  } catch (error) {
    logger.error(`Error removing conversation: ${error.message}`);
    throw new Error('Failed to remove conversation');
  }
};

module.exports = {
  getAllConversations,
  addConversation,
  findConversationById,
  modifyConversation,
  removeConversation,
};
