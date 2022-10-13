// npm run start::debug -- --server

import {DEFAULT_PORT, HttpCode} from "../const.js";
import {createRoutes} from "../api/index.js";
import express from "express";
import {getLogger} from "../lib/logger.js";

const logger = getLogger({name: `api`});

const startServer = async (port) => {
  const app = express();


  app.use(express.json());

  // все маршруты
  app.use((req, res, next) => {
    logger.info(`Request on route ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Method: ${req.method}. Response status code ${res.statusCode}`);
      console.log(res);
    });
    next();
  });

  const myRouters = await createRoutes();

  app.use(`/api/`, myRouters);

  // несуществующий маршрут
  app.use((req, res, _next) => {
    res.status(HttpCode.NOT_FOUND).send(`Not found`);
    logger.error(`Route not found: ${req.url}`);
  });

  // любые ошибки
  app.use((err, _req, _res, _next) => {
    logger.error(`An error occurred on processing request: ${err.message}`);
  });

  app.listen(port, () => {
    logger.info(`Listening to connections on ${port}`);
  }).on(`error`, (err) => {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(1);
  });
};

export default {
  name: `--server`,
  run(args) {
    const [count] = args;
    const port = Number.parseInt(count, 10) || DEFAULT_PORT;
    startServer(port);
  },
};
