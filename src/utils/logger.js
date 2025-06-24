const { createLogger, format, transports } = require("winston");
const Transport = require("winston-transport");

/**
 * Custom transport that discards all logs silently.
 */
class NullTransport extends Transport {
  constructor(options) {
    super(options);
    this.name = "NullTransport";
  }

  log(info, callback) {
    setImmediate(() => callback(null, true));
  }
}

/**
 * Creates a logger instance.
 * @returns {Object} Logger instance with info, warn, error, and debug methods.
 */
const logger = createLogger({
  level: "debug",
  format: format.combine(format.timestamp(), format.json()),
  transports:
    process.env.NODE_ENV === "test"
      ? [new transports.Console()]
      : [new NullTransport()],
});

module.exports = {
  info: logger.info.bind(logger),
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  debug: logger.debug.bind(logger),
};
