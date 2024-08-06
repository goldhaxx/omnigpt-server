// src/routes/messageRoutes.js
const express = require('express');
const { handleSendMessage, handleSaveConversation, handleGetConversations, addMessageToConversation, getMessagesByConversationId } = require('../controllers/messageController');
const router = express.Router();

router.post('/send-message', handleSendMessage);
router.post('/save-conversation', handleSaveConversation);
router.get('/conversations', handleGetConversations);
router.post('/messages', addMessageToConversation);
router.get('/messages/:conversationId', getMessagesByConversationId);

module.exports = router;
