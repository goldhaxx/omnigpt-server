// serverConversationStorageService.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const conversationsPath = path.resolve(__dirname, '../data/conversations.json');

module.exports = {
  getConversations() {
    console.log('Checking if conversations file exists...');
    if (!fs.existsSync(conversationsPath)) {
      console.log('Conversations file does not exist. Creating a new one.');
      fs.writeFileSync(conversationsPath, JSON.stringify([]));
      return [];
    }

    try {
      console.log('Reading conversations file...');
      const data = fs.readFileSync(conversationsPath, 'utf-8');
      if (!data) {
        console.log('Conversations file is empty. Returning an empty array.');
        return [];
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading or parsing conversations file:', err);
      return [];
    }
  },

  saveConversation(conversation) {
    try {
      let conversations = this.getConversations();
      const index = conversations.findIndex(c => c.id === conversation.id);

      if (index === -1) {
        conversations.push(conversation);
        console.log('New conversation saved:', conversation);
      } else {
        conversations[index] = conversation;
        console.log('Updated conversation:', conversation);
      }

      fs.writeFileSync(conversationsPath, JSON.stringify(conversations, null, 2));
      console.log('Conversations file successfully updated.');
    } catch (err) {
      console.error('Error saving conversation:', err);
    }
  },

  addMessageToConversation(conversationId, message, isUser = true) {
    try {
      let conversations = this.getConversations();
      const conversation = conversations.find(c => c.id === conversationId);

      if (conversation) {
        const validMessage = message && typeof message === 'string';
        conversation.messages.push({ role: isUser ? 'user' : 'assistant', content: validMessage ? message : '[Empty message]' });
        this.saveConversation(conversation);
      } else {
        console.error('Conversation not found:', conversationId);
      }
    } catch (err) {
      console.error('Error adding message to conversation:', err);
    }
  },

  createNewConversation() {
    try {
      const newConversation = {
        id: uuidv4(),
        title: '',
        messages: []
      };
      this.saveConversation(newConversation);
      console.log('New conversation created:', newConversation);
      return newConversation;
    } catch (err) {
      console.error('Error creating new conversation:', err);
      return null;
    }
  }
};
