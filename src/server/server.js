// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiKeyService = require('./serverApiKeyService');
const conversationStorageService = require('./serverConversationStorageService');
const messageBroker = require('./messageBroker');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());

// Route to save API key for a provider
app.post('/api/save-api-key', (req, res) => {
  const { provider, key } = req.body;
  
  if (!provider || !key) {
    return res.status(400).json({ error: 'Provider and API key are required' });
  }

  console.log('Received save-api-key request:', { provider, key });
  apiKeyService.setApiKey(provider, key);
  res.sendStatus(200);
});

// Route to get API key for a provider
app.post('/api/get-api-key', (req, res) => {
  const { provider } = req.body;
  
  if (!provider) {
    return res.status(400).json({ error: 'Provider is required' });
  }

  console.log('Received get-api-key request:', { provider });
  const apiKey = apiKeyService.getApiKey(provider);
  res.json({ apiKey });
});

// Route to save a conversation
app.post('/api/save-conversation', (req, res) => {
  const { conversation } = req.body;
  
  if (!conversation) {
    return res.status(400).json({ error: 'Conversation is required' });
  }

  console.log('Received save-conversation request:', { conversation });
  conversationStorageService.saveConversation(conversation);
  res.sendStatus(200);
});

// Route to get all conversations
app.post('/api/get-conversations', (req, res) => {
  console.log('Received get-conversations request');
  const conversations = conversationStorageService.getConversations();
  res.json({ conversations });
});

// Route to send a message
app.post('/api/send-message', async (req, res) => {
  const { conversationId, userInput, provider, model } = req.body;
  console.log('Received send-message request:', { conversationId, userInput, provider, model });

  let conversation = conversationStorageService.getConversations().find(c => c.id === conversationId);

  if (!conversation) {
    console.log('No conversation found with ID:', conversationId);
    conversation = conversationStorageService.createNewConversation();
    return res.json({
      message: 'No conversation found. A new conversation has been created.',
      conversationId: conversation.id
    });
  }

  // Add user input to the conversation
  conversationStorageService.addMessageToConversation(conversationId, userInput, true);

  // Get the updated conversation with full message history
  const updatedConversation = conversationStorageService.getConversations().find(c => c.id === conversationId);

  // Extract message history for the API request
  const conversationHistory = updatedConversation.messages
    .filter(msg => msg.content) // Filter out messages with empty content
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));

  console.log('Full conversation history:', conversationHistory);

  // Ensure all messages have valid content
  if (conversationHistory.some(msg => !msg.content)) {
    console.error('Invalid message content detected:', conversationHistory);
    return res.status(400).json({ error: 'Conversation contains messages with invalid content.' });
  }

  console.log('Sending payload to messageBroker:', { conversationHistory, provider, model });

  try {
    // Send the full conversation history to the API
    const response = await messageBroker(conversationHistory, provider, model);

    if (response.error) {
      console.error('Error from messageBroker:', response.error.message);
      conversationStorageService.addMessageToConversation(conversationId, `Error: ${response.error.message}`, false);
      return res.status(500).json({ error: response.error.message });
    }

    // Add API response to the conversation
    conversationStorageService.addMessageToConversation(conversationId, response.message, false);

    res.json({ response });
  } catch (error) {
    console.error('Error sending message:', error);
    conversationStorageService.addMessageToConversation(conversationId, `Error: ${error.message}`, false);
    res.status(500).json({ error: 'Error sending message.' });
  }
});

// Route to create a new conversation
app.post('/api/create-conversation', (req, res) => {
  console.log('Received create-conversation request');
  const newConversation = conversationStorageService.createNewConversation();
  res.json({ conversation: newConversation });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
