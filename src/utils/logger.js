const { createLogger, format, transports } = require('winston');
const path = require('path');
const util = require('util');  // To stringify objects in log output

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      let log = `${timestamp} ${level}: ${message}`;
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