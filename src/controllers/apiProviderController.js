// src/controllers/apiProviderController.js
const { readApiProvidersFromFile, addApiProvider, findApiProviderById, modifyApiProvider, removeApiProvider } = require('../services/apiProviderService');

const getAllProviders = (req, res) => {
  const providers = readApiProvidersFromFile();
  res.json(providers);
};

const createProvider = (req, res) => {
  const newProvider = addApiProvider(req.body);
  res.status(201).json(newProvider);
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
  const updatedProvider = modifyApiProvider(req.params.id, req.body);
  if (updatedProvider) {
    res.json(updatedProvider);
  } else {
    res.status(404).json({ error: 'Provider not found' });
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
