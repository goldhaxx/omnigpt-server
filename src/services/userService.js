const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { readJsonFromFile, writeJsonToFile } = require('../utils/fileUtils');
const logger = require('../utils/logger');

const usersPath = path.resolve(__dirname, '../data/users.json');

const readUsersFromFile = () => {
    try {
        logger.info('Reading users from file');
        return readJsonFromFile(usersPath);
    } catch (error) {
        logger.error(`Error reading users from file: ${error.message}`);
        throw new Error('Failed to read users');
    }
};

const addUser = async (user) => {
    logger.info('Adding a new user', { username: user.username });
    const users = readUsersFromFile();
    const existingUser = users.find(u => u.username === user.username);
    if (existingUser) {
        logger.warn('Username already exists', { username: user.username });
        throw new Error('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, id: uuidv4(), created: new Date().toISOString(), password: hashedPassword };
    users.push(newUser);
    writeJsonToFile(usersPath, users);
    logger.info('User added successfully', { username: user.username, userId: newUser.id });
    return newUser;
};

const findUserById = (id) => {
    logger.info('Finding user by ID', { userId: id });
    const users = readUsersFromFile();
    return users.find(user => user.id === id);
};

const findUserByUsername = (username) => {
    logger.info('Finding user by username', { username });
    const users = readUsersFromFile();
    return users.find(user => user.username === username);
};

const modifyUser = (id, updates) => {
    logger.info('Modifying user', { userId: id, updates });
    const users = readUsersFromFile();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        writeJsonToFile(usersPath, users);
        logger.info('User modified successfully', { userId: id });
        return users[index];
    }
    logger.warn('User not found for modification', { userId: id });
    return null;
};

const removeUser = (id) => {
    logger.info('Removing user', { userId: id });
    let users = readUsersFromFile();
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    writeJsonToFile(usersPath, users);
    const success = users.length < initialLength;
    if (success) {
        logger.info('User removed successfully', { userId: id });
    } else {
        logger.warn('User not found for removal', { userId: id });
    }
    return success;
};

// Function to validate user credentials
const validateUserCredentials = async (username, password) => {
    try {
        logger.info('Validating user credentials', { username });
        const user = findUserByUsername(username);
        if (!user) {
            logger.warn(`User not found for username: ${username}`);
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            logger.info('User credentials validated successfully', { userId: user.id });
            return user.id;
        } else {
            logger.warn(`Password mismatch for username: ${username}`);
            return null;
        }
    } catch (error) {
        logger.error(`Error in validateUserCredentials: ${error.message}`);
        throw new Error('Failed to validate user credentials');
    }
};

module.exports = {
    addUser,
    findUserById,
    findUserByUsername,
    modifyUser,
    removeUser,
    readUsersFromFile,
    validateUserCredentials, // Exporting the validateUserCredentials function
};
