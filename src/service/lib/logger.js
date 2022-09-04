import pino from 'pino';
import {Env} from '../const.js';

const LOG_FILE = `logs/api.logs`;
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;

const pinoOptions = {
  name: `base-logger`,
  level: isDevMode ? `info` : `error`,
};

if (isDevMode) {
  pinoOptions.transport = {
    target: `pino-pretty`,
    options: {
      colorize: true
    }
  };
}

const logger = pino(
    pinoOptions,
    isDevMode ? pino.destination(1) : pino.destination({dest: LOG_FILE, sync: false})
);

const getLogger = (options = {}) => {
  return logger.child(options);
};

export {
  logger,
  getLogger
};
