// src/controllers/conversationController.js
const {
  getAllConversations,
  getConversationsByUserId,
  addConversation,
  findConversationById,
  modifyConversation,
  removeConversation
} = require('../services/conversationService');
const logger = require('../utils/logger');

const fetchConversations = (req, res) => {
  const { userId } = req.query;
  try {
    logger.info('Fetching all conversations...');
    const conversations = userId ? getConversationsByUserId(userId) : getAllConversations();
    logger.info('Conversations fetched successfully:', conversations);
    res.json(conversations);
  } catch (error) {
    logger.error('Failed to fetch conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

const createConversation = (req, res) => {
  const { title, userId } = req.body;
  try {
    const newConversation = addConversation({ title, userId });
    res.status(201).json(newConversation);
  } catch (error) {
    logger.error('Failed to create conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

const getConversation = (req, res) => {
  const { id } = req.params;
  try {
    const conversation = findConversationById(id);
    if (conversation) {
      res.json(conversation);
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  } catch (error) {
    logger.error('Failed to get conversation:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

const updateConversation = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedConversation = modifyConversation(id, { title });
    if (updatedConversation) {
      res.json(updatedConversation);
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  } catch (error) {
    logger.error('Failed to update conversation:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
};

const deleteConversation = (req, res) => {
  const { id } = req.params;
  try {
    const success = removeConversation(id);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  } catch (error) {
    logger.error('Failed to delete conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

module.exports = {
  fetchConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation
};
