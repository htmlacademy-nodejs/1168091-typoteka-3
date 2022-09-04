import {DEFAULT_PORT, HttpCode} from "../const.js";
import router from "../api/index.js";
import express from "express";
import {getLogger} from "../lib/logger.js";

const logger = getLogger({name: `api`});

const startServer = (port) => {
  const app = express();
  app.use(express.json());
  app.use(router);

  // несуществующий маршрут
  app.use((req, res) => {
    res.status(HttpCode.NOT_FOUND).send(`Not found`);
    logger.error(`Route not found: ${req.url}`);
  });

  // любые ошибки
  app.use((err, _req, _res, _next) => {
    logger.error(`An error occurred on processing request: ${err.message}`);
  });

  app.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });
    next();
  });

  try {
    app.listen(port, (err) => {
      if (err) {
        return logger.error(`An error occurred on server creation: ${err.message}`);
      }
      return logger.info(`Listening to connections on ${port}`);
    });

  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(1);
  }
};

export default {
  name: `--server`,
  run(args) {
    const [count] = args;
    const port = Number.parseInt(count, 10) || DEFAULT_PORT;
    startServer(port);
  },
};
