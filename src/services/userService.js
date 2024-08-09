// src/services/userService.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const usersPath = path.resolve(__dirname, '../data/users.json');

const readUsersFromFile = () => {
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, JSON.stringify([]));
  }
  try {
    const data = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(data || '[]'); // Handle empty file
  } catch (error) {
    console.error('Error reading users file:', error);
    return []; // Return empty array on error
  }
};

const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users file:', error);
  }
};

const addUser = async (user) => {
  const users = readUsersFromFile();
  const existingUser = users.find(u => u.username === user.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = { ...user, id: uuidv4(), created: new Date().toISOString(), password: hashedPassword };
  users.push(newUser);
  writeUsersToFile(users);
  return newUser;
};

const findUserById = (id) => {
  const users = readUsersFromFile();
  return users.find(user => user.id === id);
};

const findUserByUsername = (username) => {
  const users = readUsersFromFile();
  return users.find(user => user.username === username);
};

const modifyUser = (id, updates) => {
  const users = readUsersFromFile();
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    writeUsersToFile(users);
    return users[index];
  }
  return null;
};

const removeUser = (id) => {
  let users = readUsersFromFile();
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  writeUsersToFile(users);
  return users.length < initialLength;
};

const validateUserCredentials = async (username, password) => {
  const user = findUserByUsername(username);
  if (user && await bcrypt.compare(password, user.password)) {
    return user.id;
  }
  return null;
};

module.exports = {
  addUser,
  findUserById,
  findUserByUsername,
  modifyUser,
  removeUser,
  validateUserCredentials,
  readUsersFromFile
};
