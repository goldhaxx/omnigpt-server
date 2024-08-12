const fs = require('fs');
const logger = require('./logger');

/**
 * Reads JSON data from a file and parses it into an object.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Object} - The parsed JSON data or an empty array if the file is empty.
 */
const readJsonFromFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        logger.warn(`File does not exist, creating new file at: ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify([]));
    }

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        logger.error(`Error reading JSON from file: ${filePath}`, { message: error.message });
        throw new Error('Failed to read from file');
    }
};

/**
 * Writes JSON data to a file.
 * @param {string} filePath - The path to the JSON file.
 * @param {Object} data - The data to write to the file.
 */
const writeJsonToFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        logger.info(`Data successfully written to file: ${filePath}`);
    } catch (error) {
        logger.error(`Error writing JSON to file: ${filePath}`, { message: error.message });
        throw new Error('Failed to write to file');
    }
};

module.exports = {
    readJsonFromFile,
    writeJsonToFile
};
