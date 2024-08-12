// src/controllers/messageController.js
const { sendMessage, saveConversationService, getAllConversations, addMessageToConversationService, getMessagesByConversationIdService } = require('../services/messageService');
const logger = require('../utils/logger');

const handleSendMessage = async (req, res) => {
  logger.info('handleSendMessage invoked', { body: req.body });

  const { conversationId, userInput, provider, model, userId } = req.body;
  if (!conversationId || !userInput || !provider || !model || !userId) {
    logger.warn('Missing required fields in handleSendMessage');
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
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
    const { conversationId, message, role, provider, model } = req.body;
    if (!conversationId || !message || !role || !provider || !model) {
      logger.warn('conversationId, message, role, provider, and model are required in addMessageToConversation');
      return res.status(400).json({ error: 'conversationId, message, role, provider, and model are required' });
    }

    const newMessage = addMessageToConversationService(conversationId, { content: message, role, provider, model });
    logger.info('Message added to conversation successfully', { conversationId, message, role, provider, model });
    res.status(201).json(newMessage);
  } catch (error) {
    logger.error(`Failed to add message to conversation: ${error.message}`);
    res.status(500).json({ error: `Failed to add message to conversation: ${error.message}` });
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