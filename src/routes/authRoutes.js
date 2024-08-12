const express = require('express');
const { login } = require('../controllers/authController');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/login', (req, res, next) => {
  logger.info('POST /login route hit');
  next();
}, login);

module.exports = router;
