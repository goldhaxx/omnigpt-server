const express = require('express');
const {
  createUserApiProvider,
  createNewUserApiProvider,
  getUserApiProvider,
  updateUserApiProvider,
  deleteUserApiProvider,
  getAllUserApiProviders,
  getUserApiProvidersByUserId,
  deleteUserApiProviderByProviderId,
} = require('../controllers/userApiProviderController');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/user-api-providers', (req, res, next) => {
  logger.info('POST /user-api-providers route hit');
  next();
}, createUserApiProvider);

router.post('/user-api-providers/provider/new', (req, res, next) => {
  logger.info('POST /user-api-providers/provider/new route hit');
  next();
}, createNewUserApiProvider);

router.get('/user-api-providers/:id', (req, res, next) => {
  logger.info(`GET /user-api-providers/:id route hit with ID: ${req.params.id}`);
  next();
}, getUserApiProvider);

router.put('/user-api-providers/:id', (req, res, next) => {
  logger.info(`PUT /user-api-providers/:id route hit with ID: ${req.params.id}`);
  next();
}, updateUserApiProvider);

router.delete('/user-api-providers/:id', (req, res, next) => {
  logger.info(`DELETE /user-api-providers/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteUserApiProvider);

router.delete('/user-api-providers/provider/delete/:id', (req, res, next) => {
  logger.info(`DELETE /user-api-providers/provider/delete/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteUserApiProviderByProviderId);

router.get('/user-api-providers', (req, res, next) => {
  logger.info('GET /user-api-providers route hit');
  next();
}, getAllUserApiProviders);

router.get('/user-api-providers/user/:userId', (req, res, next) => {
  logger.info(`GET /user-api-providers/user/:userId route hit with UserID: ${req.params.userId}`);
  next();
}, getUserApiProvidersByUserId);

module.exports = router;
