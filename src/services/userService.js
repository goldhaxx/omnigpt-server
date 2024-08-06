// src/services/userService.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const usersPath = path.resolve(__dirname, '../data/users.json');

// Function to read users from file
const readUsersFromFile = () => {
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, JSON.stringify([]));
  }
  try {
    const data = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(data || '[]'); // Handle empty file
  } catch (error) {
    logger.error('Error reading users file:', error);
    return []; // Return empty array on error
  }
};

// Function to write users to file
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    logger.info('Users written to file successfully.');
  } catch (error) {
    logger.error('Error writing to users file:', error);
  }
};

// Function to add a user
const addUser = (user) => {
  const users = readUsersFromFile();
  const newUser = { ...user, id: uuidv4(), created: Date.now() };
  users.push(newUser);
  writeUsersToFile(users);
  logger.info('User added successfully:', newUser);
  return newUser;
};

// Function to find a user by ID
const findUserById = (id) => {
  const users = readUsersFromFile();
  return users.find(user => user.id === id);
};

// Function to modify a user
const modifyUser = (id, updates) => {
  const users = readUsersFromFile();
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    writeUsersToFile(users);
    logger.info('User modified successfully:', users[index]);
    return users[index];
  }
  return null;
};

// Function to remove a user
const removeUser = (id) => {
  let users = readUsersFromFile();
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  writeUsersToFile(users);
  const success = users.length < initialLength;
  logger.info(`User removal status: ${success}`);
  return success;
};

module.exports = {
  addUser,
  findUserById,
  modifyUser,
  removeUser,
  readUsersFromFile,
  writeUsersToFile
};