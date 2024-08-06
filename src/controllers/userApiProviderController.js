// src/controllers/userApiProviderController.js
const {
  readUserApiProvidersFromFile,
  addUserApiProvider,
  findUserApiProviderById,
  modifyUserApiProvider,
  removeUserApiProvider
} = require('../services/userApiProviderService');

const createUserApiProvider = (req, res) => {
  const { userId, providerId, apiKey } = req.body;
  const newUserApiProvider = addUserApiProvider({ userId, providerId, apiKey });
  res.status(201).json(newUserApiProvider);
};

const getUserApiProvider = (req, res) => {
  const { id } = req.params;
  const userApiProvider = findUserApiProviderById(id);
  if (userApiProvider) {
    res.json(userApiProvider);
  } else {
    res.status(404).json({ error: 'User API provider not found' });
  }
};

const getAllUserApiProviders = (req, res) => {
  try {
    console.log('Fetching all user API providers');
    const userApiProviders = readUserApiProvidersFromFile();
    console.log('User API providers fetched successfully:', userApiProviders);
    res.json(userApiProviders);
  } catch (error) {
    console.error('Error fetching user API providers:', error);
    res.status(500).json({ error: 'Failed to fetch user API providers' });
  }
};

const updateUserApiProvider = (req, res) => {
  const { id } = req.params;
  const { userId, providerId, apiKey } = req.body;
  const updatedUserApiProvider = modifyUserApiProvider(id, { userId, providerId, apiKey });
  if (updatedUserApiProvider) {
    res.json(updatedUserApiProvider);
  } else {
    res.status(404).json({ error: 'User API provider not found' });
  }
};

const deleteUserApiProvider = (req, res) => {
  const { id } = req.params;
  const success = removeUserApiProvider(id);
  if (success) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'User API provider not found' });
  }
};

module.exports = {
  createUserApiProvider,
  getUserApiProvider,
  updateUserApiProvider,
  deleteUserApiProvider,
  getAllUserApiProviders // Ensure this is exported
};
