/**
 * @file conversationRoutes.js
 * @description Routes for managing conversations, including fetching, creating, updating, and deleting conversations.
 * Each route logs the request before passing control to the respective controller method.
 */

const express = require('express');
const {
  fetchConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
} = require('../controllers/conversationController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route GET /api/conversations
 * @description Fetches all conversations or conversations filtered by a user ID if provided.
 * @access Public
 */
router.get('/conversations', (req, res, next) => {
  logger.info('GET /conversations route hit');
  next();
}, fetchConversations);

/**
 * @route POST /api/conversations
 * @description Creates a new conversation.
 * @access Public
 */
router.post('/conversations', (req, res, next) => {
  logger.info('POST /conversations route hit');
  next();
}, createConversation);

/**
 * @route GET /api/conversations/:id
 * @description Fetches a specific conversation by its ID.
 * @access Public
 */
router.get('/conversations/:id', (req, res, next) => {
  logger.info(`GET /conversations/:id route hit with ID: ${req.params.id}`);
  next();
}, getConversation);

/**
 * @route PUT /api/conversations/:id
 * @description Updates a specific conversation by its ID.
 * @access Public
 */
router.put('/conversations/:id', (req, res, next) => {
  logger.info(`PUT /conversations/:id route hit with ID: ${req.params.id}`);
  next();
}, updateConversation);

/**
 * @route DELETE /api/conversations/:id
 * @description Deletes a specific conversation by its ID.
 * @access Public
 */
router.delete('/conversations/:id', (req, res, next) => {
  logger.info(`DELETE /conversations/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteConversation);

module.exports = router;
