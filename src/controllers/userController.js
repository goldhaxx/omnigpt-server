// src/controllers/userController.js

const { addUser, findUserById, modifyUser, removeUser, readUsersFromFile, writeUsersToFile } = require('../services/userService');
const logger = require('../utils/logger'); // Import the logger module


const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    logger.warn('Username, email, and password are required to create a user');
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  try {
    const newUser = await addUser({ username, email, password });
    logger.info('User created successfully', { username, email });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === 'Username already exists') {
      logger.warn('Attempted to create a user with an existing username', { username });
      res.status(409).json({ error: 'Username already exists' });
    } else {
      logger.error(`Error creating user: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const getUsers = (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const user = findUserById(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedUser = modifyUser(id, updates);
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  const success = removeUser(id);
  if (success) {
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
};
