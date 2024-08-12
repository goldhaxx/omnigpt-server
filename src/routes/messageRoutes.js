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

// Directly use the middleware arrays in the routes
router.post('/send-message', (req, res, next) => {
  logger.info('POST /send-message route hit');
  next();
}, handleSendMessage);

router.post('/save-conversation', (req, res, next) => {
  logger.info('POST /save-conversation route hit');
  next();
}, handleSaveConversation);

router.get('/conversations', (req, res, next) => {
  logger.info('GET /conversations route hit');
  next();
}, handleGetConversations);

router.post('/messages', (req, res, next) => {
  logger.info('POST /messages route hit');
  next();
}, addMessageToConversation);

router.get('/messages/:conversationId', (req, res, next) => {
  logger.info(`GET /messages/:conversationId route hit with conversationId: ${req.params.conversationId}`);
  next();
}, getMessagesByConversationId);

module.exports = router;
