const { check, validationResult } = require('express-validator');
const {
  sendMessage,
  saveConversationService,
  getAllConversations,
  addMessageToConversationService,
  getMessagesByConversationIdService,
} = require('../services/messageService');
const logger = require('../utils/logger');

// Validation rules for sending a message
const validateSendMessage = [
  check('conversationId').notEmpty().withMessage('conversationId is required'),
  check('userInput').notEmpty().withMessage('userInput is required'),
  check('provider').notEmpty().withMessage('provider is required'),
  check('model').notEmpty().withMessage('model is required'),
  check('userId').notEmpty().withMessage('userId is required'),
];

const handleSendMessage = [
  validateSendMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for handleSendMessage', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    logger.info('handleSendMessage invoked', { body: req.body });

    const { conversationId, userInput, provider, model, userId } = req.body;

    try {
      logger.info('Sending message to LLM API', { conversationId, userInput, provider, model, userId });

      // Send message to the selected LLM API and get the response
      const response = await sendMessage(conversationId, userInput, provider, model, userId);

      logger.info('LLM API response received', { conversationId, provider, model, response });

      // Log the sent message and the received response
      await addMessageToConversationService(conversationId, { content: userInput, role: 'user', provider, model });
      await addMessageToConversationService(conversationId, { content: response, role: 'assistant', provider, model });

      logger.info('Message processing completed successfully', { conversationId, userInput, provider, model, userId });
      res.json({ message: response });
    } catch (error) {
      logger.error(`Error in handleSendMessage: ${error.message}`, { conversationId, provider, model, userId });
      res.status(500).json({ error: error.message });
    }
  }
];

const handleSaveConversation = [
  check('conversation').notEmpty().withMessage('Conversation is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for handleSaveConversation', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { conversation } = req.body;
    try {
      saveConversationService(conversation);
      logger.info('Conversation saved successfully', { conversation });
      res.sendStatus(200);
    } catch (error) {
      logger.error(`Error in handleSaveConversation: ${error.message}`);
      res.status(500).json({ error: 'Failed to save conversation' });
    }
  }
];

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

const addMessageToConversation = [
  check('conversationId').notEmpty().withMessage('conversationId is required'),
  check('message').notEmpty().withMessage('message is required'),
  check('role').notEmpty().withMessage('role is required'),
  check('provider').notEmpty().withMessage('provider is required'),
  check('model').notEmpty().withMessage('model is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for addMessageToConversation', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { conversationId, message, role, provider, model } = req.body;
      const newMessage = addMessageToConversationService(conversationId, { content: message, role, provider, model });
      logger.info('Message added to conversation successfully', { conversationId, message, role, provider, model });
      res.status(201).json(newMessage);
    } catch (error) {
      logger.error(`Failed to add message to conversation: ${error.message}`);
      res.status(500).json({ error: `Failed to add message to conversation: ${error.message}` });
    }
  }
];

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
