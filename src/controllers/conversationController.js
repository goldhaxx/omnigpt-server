const { check, validationResult } = require('express-validator');
const {
  getAllConversations,
  getConversationsByUserId,
  addConversation,
  findConversationById,
  modifyConversation,
  removeConversation,
} = require('../services/conversationService');
const logger = require('../utils/logger');

// Validation rules for creating and updating a conversation
const validateConversation = [
  check('title').notEmpty().withMessage('Title is required'),
  check('userId').notEmpty().withMessage('User ID is required'),
];

const fetchConversations = (req, res) => {
  const { userId } = req.query;
  try {
    logger.info('Fetching all conversations...');
    const conversations = userId ? getConversationsByUserId(userId) : getAllConversations();
    logger.info('Conversations fetched successfully.');
    res.json(conversations);
  } catch (error) {
    logger.error('Failed to fetch conversations:', { message: error.message });
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

const createConversation = [
  validateConversation,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for createConversation', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, userId } = req.body;
    try {
      const newConversation = addConversation({ title, userId });
      logger.info('Conversation created successfully:', newConversation);
      res.status(201).json(newConversation);
    } catch (error) {
      logger.error('Failed to create conversation:', { message: error.message });
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }
];

const getConversation = (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Fetching conversation with ID: ${id}`);
    const conversation = findConversationById(id);
    if (conversation) {
      logger.info('Conversation fetched successfully.');
      res.json(conversation);
    } else {
      logger.warn(`Conversation not found for ID: ${id}`);
      res.status(404).json({ error: 'Conversation not found' });
    }
  } catch (error) {
    logger.error('Failed to get conversation:', { message: error.message });
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

const updateConversation = [
  check('title').notEmpty().withMessage('Title is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for updateConversation', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title } = req.body;
    try {
      logger.info(`Updating conversation with ID: ${id}`);
      const updatedConversation = modifyConversation(id, { title });
      if (updatedConversation) {
        logger.info('Conversation updated successfully.');
        res.json(updatedConversation);
      } else {
        logger.warn(`Conversation not found for ID: ${id}`);
        res.status(404).json({ error: 'Conversation not found' });
      }
    } catch (error) {
      logger.error('Failed to update conversation:', { message: error.message });
      res.status(500).json({ error: 'Failed to update conversation' });
    }
  }
];

const deleteConversation = (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Deleting conversation with ID: ${id}`);
    const success = removeConversation(id);
    if (success) {
      logger.info('Conversation deleted successfully.');
      res.sendStatus(204);
    } else {
      logger.warn(`Conversation not found for ID: ${id}`);
      res.status(404).json({ error: 'Conversation not found' });
    }
  } catch (error) {
    logger.error('Failed to delete conversation:', { message: error.message });
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

module.exports = {
  fetchConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
};
