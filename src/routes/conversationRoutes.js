// src/routes/conversationRoutes.js
const express = require('express');
const {
  fetchConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation
} = require('../controllers/conversationController');

const router = express.Router();

router.get('/conversations', fetchConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id', getConversation);
router.put('/conversations/:id', updateConversation);
router.delete('/conversations/:id', deleteConversation);

module.exports = router;
