// src/routes/messageRoutes.js
const express = require('express');
const { handleSendMessage, handleSaveConversation, handleGetConversations, addMessageToConversation, getMessagesByConversationId } = require('../controllers/messageController');
const router = express.Router();

//router.post('/send-message', handleSendMessage, addMessageToConversation);
// Combine functionality of /send-message and /messages
router.post('/send-message', async (req, res, next) => {
    try {
      // First, handle the sending of the message
      const response = await handleSendMessage(req, res, next);
      
      // Then, add the message to the conversation if sending was successful
      if (response && res.statusCode === 200) {
        await addMessageToConversation(req, res, next);
      }
    } catch (error) {
      next(error);
    }
  });
router.post('/save-conversation', handleSaveConversation);
router.get('/conversations', handleGetConversations);
router.post('/messages', addMessageToConversation);
router.get('/messages/:conversationId', getMessagesByConversationId);

module.exports = router;
