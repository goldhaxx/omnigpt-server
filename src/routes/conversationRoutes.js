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

router.get('/conversations', (req, res, next) => {
  logger.info('GET /conversations route hit');
  next();
}, fetchConversations);

router.post('/conversations', (req, res, next) => {
  logger.info('POST /conversations route hit');
  next();
}, createConversation);

router.get('/conversations/:id', (req, res, next) => {
  logger.info(`GET /conversations/:id route hit with ID: ${req.params.id}`);
  next();
}, getConversation);

router.put('/conversations/:id', (req, res, next) => {
  logger.info(`PUT /conversations/:id route hit with ID: ${req.params.id}`);
  next();
}, updateConversation);

router.delete('/conversations/:id', (req, res, next) => {
  logger.info(`DELETE /conversations/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteConversation);

module.exports = router;
