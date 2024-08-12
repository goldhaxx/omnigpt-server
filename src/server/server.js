const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('../routes/userRoutes');
const apiProviderRoutes = require('../routes/apiProviderRoutes');
const userApiProviderRoutes = require('../routes/userApiProviderRoutes');
const conversationRoutes = require('../routes/conversationRoutes');
const messageRoutes = require('../routes/messageRoutes');
const authRoutes = require('../routes/authRoutes');
const messageBroker = require('./messageBroker');
const logger = require('../utils/logger');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', apiProviderRoutes);
app.use('/api', userApiProviderRoutes);
app.use('/api', conversationRoutes);
app.use('/api', messageRoutes);
app.use('/api', authRoutes);

app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3001;

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  logger.info('New WebSocket connection established');

  ws.on('message', (message) => {
    logger.info(`Received message via WebSocket: ${message}`);
  });

  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });
});

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = { app };
