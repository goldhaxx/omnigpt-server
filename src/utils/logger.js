const { createLogger, format, transports } = require('winston');
const path = require('path');
const util = require('util');  // To stringify objects in log output

const addFileName = format((info) => {
  const callerFile = (new Error().stack.split('\n')[7] || '').trim();
  const fileName = callerFile ? callerFile.split('/').slice(-1)[0].split(':')[0] : 'unknown';
  info.fileName = fileName;
  return info;
});

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
