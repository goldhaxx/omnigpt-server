/**
 * @file logger.js
 * @description Configures and exports a Winston logger instance that logs to both the console and a file.
 *              The logger includes a timestamp, log level, and filename of the caller. It also stringifies any additional metadata.
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');
const util = require('util');  // To stringify objects in log output

/**
 * Custom Winston format to add the filename of the log's caller to the log entry.
 * This format extracts the filename from the stack trace.
 * 
 * @returns {Object} The modified log info with the `fileName` property.
 */
const addFileName = format((info) => {
  const callerFile = (new Error().stack.split('\n')[7] || '').trim();
  const fileName = callerFile ? callerFile.split('/').slice(-1)[0].split(':')[0] : 'unknown';
  info.fileName = fileName;
  return info;
});

/**
 * Creates a Winston logger instance with the following features:
 * - Logs both to the console and to a file (`app.log`).
 * - Includes a timestamp, log level, and filename of the caller in each log entry.
 * - Stringifies any additional metadata for detailed log output.
 * 
 * @returns {Object} The configured Winston logger instance.
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    addFileName(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, fileName, ...meta }) => {
      let log = `${timestamp} [${fileName}] ${level}: ${message}`;
      if (Object.keys(meta).length > 0) {
        log += ` ${util.inspect(meta, { depth: null, colors: true })}`;
      }
      return log;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.resolve(__dirname, '../data/app.log') })
  ],
});

module.exports = logger;
