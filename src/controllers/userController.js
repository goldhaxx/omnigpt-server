// src/controllers/userController.js

const { addUser, findUserById, modifyUser, removeUser, readUsersFromFile } = require('../services/userService');

const createUser = (req, res) => {
  const user = req.body;
  const newUser = addUser(user);
  res.status(201).json(newUser);
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
};
