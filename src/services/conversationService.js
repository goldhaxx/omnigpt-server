const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { readJsonFromFile, writeJsonToFile } = require('../utils/fileUtils');

const conversationsPath = path.resolve(__dirname, '../data/conversations.json');

const getAllConversations = () => {
    try {
        logger.info('Fetching all conversations');
        const conversations = readJsonFromFile(conversationsPath);
        logger.info('Conversations fetched successfully', { count: conversations.length });
        return conversations;
    } catch (error) {
        logger.error(`Failed to fetch conversations: ${error.message}`);
        throw new Error('Failed to fetch conversations');
    }
};

const getConversationsByUserId = (userId) => {
    try {
        logger.info('Fetching conversations by user ID', { userId });
        const conversations = readJsonFromFile(conversationsPath);
        const userConversations = conversations.filter(conversation => conversation.userId === userId);
        logger.info('Conversations fetched successfully for user', { userId, count: userConversations.length });
        return userConversations;
    } catch (error) {
        logger.error(`Failed to fetch conversations by user ID: ${error.message}`, { userId });
        throw new Error('Failed to fetch conversations by user ID');
    }
};

const addConversation = (conversation) => {
    try {
        logger.info('Adding a new conversation', { conversation });
        const conversations = readJsonFromFile(conversationsPath);
        const newConversation = { ...conversation, id: uuidv4(), timestamp: Date.now() };
        conversations.push(newConversation);
        writeJsonToFile(conversationsPath, conversations);
        logger.info('Conversation added successfully', { newConversation });
        return newConversation;
    } catch (error) {
        logger.error(`Failed to add conversation: ${error.message}`, { conversation });
        throw new Error('Failed to add conversation');
    }
};

const findConversationById = (id) => {
    logger.info('Finding conversation by ID', { id });
    const conversations = readJsonFromFile(conversationsPath);
    const conversation = conversations.find(conversation => conversation.id === id);
    if (conversation) {
        logger.info('Conversation found', { conversation });
    } else {
        logger.warn('No conversation found for ID', { id });
    }
    return conversation;
};

const modifyConversation = (id, updates) => {
    try {
        logger.info('Modifying conversation', { id, updates });
        const conversations = readJsonFromFile(conversationsPath);
        const index = conversations.findIndex(conversation => conversation.id === id);
        if (index !== -1) {
            conversations[index] = { ...conversations[index], ...updates };
            writeJsonToFile(conversationsPath, conversations);
            logger.info('Conversation modified successfully', { updatedConversation: conversations[index] });
            return conversations[index];
        }
        logger.warn('No conversation found to modify', { id });
        return null;
    } catch (error) {
        logger.error(`Failed to modify conversation: ${error.message}`, { id, updates });
        throw new Error('Failed to modify conversation');
    }
};

const removeConversation = (id) => {
    try {
        logger.info('Removing conversation', { id });
        let conversations = readJsonFromFile(conversationsPath);
        const initialLength = conversations.length;
        conversations = conversations.filter(conversation => conversation.id !== id);
        writeJsonToFile(conversationsPath, conversations);
        const success = conversations.length < initialLength;
        if (success) {
            logger.info('Conversation removed successfully', { id });
        } else {
            logger.warn('No conversation found to remove', { id });
        }
        return success;
    } catch (error) {
        logger.error(`Failed to remove conversation: ${error.message}`, { id });
        throw new Error('Failed to remove conversation');
    }
};

module.exports = {
    getAllConversations,
    getConversationsByUserId,
    addConversation,
    findConversationById,
    modifyConversation,
    removeConversation,
};
