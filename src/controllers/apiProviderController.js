// src/controllers/apiProviderController.js
const { readApiProvidersFromFile, addApiProvider, findApiProviderById, modifyApiProvider, removeApiProvider } = require('../services/apiProviderService');
const logger = require('../utils/logger');

const getAllProviders = (req, res) => {
  const providers = readApiProvidersFromFile();
  res.json(providers);
};

const createProvider = (req, res) => {
  const { name, models } = req.body;

  if (!name || !models) {
    logger.warn('Missing required fields in createProvider');
    return res.status(400).json({ error: 'name and models are required' });
  }

  try {
    const newProvider = addApiProvider({ name, models });
    res.status(201).json(newProvider);
  } catch (error) {
    logger.error(`Error creating provider: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const getProviderById = (req, res) => {
  const provider = findApiProviderById(req.params.id);
  if (provider) {
    res.json(provider);
  } else {
    res.status(404).json({ error: 'Provider not found' });
  }
};

const updateProviderById = (req, res) => {
  const { models } = req.body;

  if (!models) {
    logger.warn('Only models can be updated in updateProviderById');
    return res.status(400).json({ error: 'Only models can be updated' });
  }

  try {
    const updatedProvider = modifyApiProvider(req.params.id, { models });
    if (updatedProvider) {
      res.json(updatedProvider);
    } else {
      res.status(404).json({ error: 'Provider not found' });
    }
  } catch (error) {
    logger.error(`Error updating provider: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

const deleteProviderById = (req, res) => {
  const success = removeApiProvider(req.params.id);
  if (success) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Provider not found' });
  }
};

module.exports = {
  getAllProviders,
  createProvider,
  getProviderById,
  updateProviderById,
  deleteProviderById
};
