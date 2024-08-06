// src/controllers/messageController.js

const { sendMessage, saveConversationService, getAllConversations, addMessageToConversationService, getMessagesByConversationIdService } = require('../services/messageService');
const logger = require('../utils/logger');

const handleSendMessage = async (req, res) => {
  const { conversationId, userInput, provider, model } = req.body;
  if (!conversationId || !userInput || !provider || !model) {
    logger.warn('Missing required fields in handleSendMessage');
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const response = await sendMessage(conversationId, userInput, provider, model);
    logger.info('Message sent successfully', { conversationId, userInput, provider, model });
    res.json(response);
  } catch (error) {
    logger.error(`Error in handleSendMessage: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const handleSaveConversation = (req, res) => {
  const { conversation } = req.body;
  if (!conversation) {
    logger.warn('Conversation is required in handleSaveConversation');
    return res.status(400).json({ error: 'Conversation is required' });
  }
  try {
    saveConversationService(conversation);
    logger.info('Conversation saved successfully', { conversation });
    res.sendStatus(200);
  } catch (error) {
    logger.error(`Error in handleSaveConversation: ${error.message}`);
    res.status(500).json({ error: 'Failed to save conversation' });
  }
};

const handleGetConversations = (req, res) => {
  try {
    const conversations = getAllConversations();
    logger.info('Conversations fetched successfully', { conversations });
    res.json(conversations);
  } catch (error) {
    logger.error(`Failed to fetch conversations: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

const addMessageToConversation = (req, res) => {
  try {
    const { conversationId, message, role } = req.body;
    if (!conversationId || !message || !role) {
      logger.warn('conversationId, message, and role are required in addMessageToConversation');
      return res.status(400).json({ error: 'conversationId, message, and role are required' });
    }

    const updatedConversation = addMessageToConversationService(conversationId, { content: message, role });
    logger.info('Message added to conversation successfully', { conversationId, message, role });
    res.status(201).json(updatedConversation);
  } catch (error) {
    logger.error(`Failed to add message to conversation: ${error.message}`);
    res.status(500).json({ error: 'Failed to add message to conversation' });
  }
};

const getMessagesByConversationId = (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = getMessagesByConversationIdService(conversationId);
    logger.info('Messages fetched successfully for conversation', { conversationId, messages });
    res.json(messages);
  } catch (error) {
    logger.error(`Failed to get messages for conversation ${conversationId}: ${error.message}`);
    res.status(500).json({ error: `Failed to get messages for conversation ${conversationId}` });
  }
};

module.exports = {
  handleSendMessage,
  handleSaveConversation,
  handleGetConversations,
  addMessageToConversation,
  getMessagesByConversationId,
};
