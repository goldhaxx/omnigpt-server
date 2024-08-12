/**
 * @file userService.js
 * @description Service for managing users, including operations like adding, modifying, and removing users, as well as validating user credentials.
 */

const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { readJsonFromFile, writeJsonToFile } = require('../utils/fileUtils');
const logger = require('../utils/logger');

const usersPath = path.resolve(__dirname, '../data/users.json');

/**
 * Reads all users from the JSON file.
 * @returns {Array} An array of users.
 * @throws Will throw an error if reading the file fails.
 */
const readUsersFromFile = () => {
    try {
        logger.info('Reading users from file');
        return readJsonFromFile(usersPath);
    } catch (error) {
        logger.error(`Error reading users from file: ${error.message}`);
        throw new Error('Failed to read users');
    }
};

/**
 * Adds a new user with a hashed password.
 * @param {Object} user - The user object containing username, email, and password.
 * @returns {Object} The newly added user.
 * @throws Will throw an error if the username already exists.
 */
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

/**
 * Finds a user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {Object|null} The user object if found, otherwise null.
 */
const findUserById = (id) => {
    logger.info('Finding user by ID', { userId: id });
    const users = readUsersFromFile();
    return users.find(user => user.id === id);
};

/**
 * Finds a user by their username.
 * @param {string} username - The username to search for.
 * @returns {Object|null} The user object if found, otherwise null.
 */
const findUserByUsername = (username) => {
    logger.info('Finding user by username', { username });
    const users = readUsersFromFile();
    return users.find(user => user.username === username);
};

/**
 * Modifies an existing user.
 * @param {string} id - The ID of the user to modify.
 * @param {Object} updates - The updates to apply to the user.
 * @returns {Object|null} The updated user if found, otherwise null.
 */
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

/**
 * Removes a user by their ID.
 * @param {string} id - The ID of the user to remove.
 * @returns {boolean} True if the user was removed, false if not found.
 * @throws Will throw an error if removing the user fails.
 */
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

/**
 * Validates user credentials by comparing the provided password with the stored hashed password.
 * @param {string} username - The username to validate.
 * @param {string} password - The password to validate.
 * @returns {string|null} The user ID if credentials are valid, otherwise null.
 * @throws Will throw an error if validation fails.
 */
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
    validateUserCredentials,
};
