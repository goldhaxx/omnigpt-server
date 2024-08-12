const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/users', (req, res, next) => {
  logger.info('POST /users route hit');
  next();
}, createUser);

router.get('/users', (req, res, next) => {
  logger.info('GET /users route hit');
  next();
}, getUsers);

router.get('/users/:id', (req, res, next) => {
  logger.info(`GET /users/:id route hit with ID: ${req.params.id}`);
  next();
}, getUserById);

router.put('/users/:id', (req, res, next) => {
  logger.info(`PUT /users/:id route hit with ID: ${req.params.id}`);
  next();
}, updateUser);

router.delete('/users/:id', (req, res, next) => {
  logger.info(`DELETE /users/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteUser);

module.exports = router;
