const express = require('express');
const router = express.Router();
const {
  getAllProviders,
  createProvider,
  getProviderById,
  updateProviderById,
  deleteProviderById,
} = require('../controllers/apiProviderController');
const logger = require('../utils/logger');

router.get('/providers', (req, res, next) => {
  logger.info('GET /providers route hit');
  next();
}, getAllProviders);

router.post('/providers', (req, res, next) => {
  logger.info('POST /providers route hit');
  next();
}, createProvider);

router.get('/providers/:id', (req, res, next) => {
  logger.info(`GET /providers/:id route hit with ID: ${req.params.id}`);
  next();
}, getProviderById);

router.put('/providers/:id', (req, res, next) => {
  logger.info(`PUT /providers/:id route hit with ID: ${req.params.id}`);
  next();
}, updateProviderById);

router.delete('/providers/:id', (req, res, next) => {
  logger.info(`DELETE /providers/:id route hit with ID: ${req.params.id}`);
  next();
}, deleteProviderById);

module.exports = router;
