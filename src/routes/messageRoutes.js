/**
 * @file messageRoutes.js
 * @description Routes for handling messages, conversations, and related operations.
 * This includes sending messages, saving conversations, fetching conversations, and managing messages within conversations.
 * Each route logs the request before passing control to the respective controller method.
 */

const express = require('express');
const {
  handleSendMessage,
  handleSaveConversation,
  handleGetConversations,
  addMessageToConversation,
  getMessagesByConversationId,
} = require('../controllers/messageController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route POST /api/send-message
 * @description Handles the sending of a message to an LLM API and adds the message to the conversation.
 * @access Public
 */
router.post('/send-message', (req, res, next) => {
  logger.info('POST /send-message route hit');
  next();
}, handleSendMessage);

/**
 * @route POST /api/save-conversation
 * @description Saves a conversation.
 * @access Public
 */
router.post('/save-conversation', (req, res, next) => {
  logger.info('POST /save-conversation route hit');
  next();
}, handleSaveConversation);

/**
 * @route GET /api/conversations
 * @description Fetches all conversations or those filtered by criteria.
 * @access Public
 */
router.get('/conversations', (req, res, next) => {
  logger.info('GET /conversations route hit');
  next();
}, handleGetConversations);

/**
 * @route POST /api/messages
 * @description Adds a message to an existing conversation.
 * @access Public
 */
router.post('/messages', (req, res, next) => {
  logger.info('POST /messages route hit');
  next();
}, addMessageToConversation);

/**
 * @route GET /api/messages/:conversationId
 * @description Fetches all messages within a specific conversation by conversation ID.
 * @access Public
 */
router.get('/messages/:conversationId', (req, res, next) => {
  logger.info(`GET /messages/:conversationId route hit with conversationId: ${req.params.conversationId}`);
  next();
}, getMessagesByConversationId);

module.exports = router;
