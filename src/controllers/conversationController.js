// src/controllers/conversationController.js
const {
    getAllConversations,
    addConversation,
    findConversationById,
    modifyConversation,
    removeConversation,
  } = require('../services/conversationService');
  const logger = require('../utils/logger');
  
  const fetchConversations = (req, res) => {
    try {
      logger.info('Fetching all conversations...');
      const conversations = getAllConversations();
      const filteredConversations = conversations.map(({ messages, ...rest }) => rest); // Remove messages key
      logger.info('Conversations fetched successfully:', filteredConversations);
      res.json(filteredConversations);
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
        const { messages, ...rest } = conversation; // Remove messages key
        res.json(rest);
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
        const { messages, ...rest } = updatedConversation; // Remove messages key
        res.json(rest);
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
    deleteConversation,
  };
  