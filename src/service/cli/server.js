'use strict';

const {DEFAULT_PORT} = require(`../const`);
const router = require(`../routes/router`);
const express = require(`express`);
const chalk = require(`chalk`);

const startServer = (port) => {
  const app = express();
  app.use(express.json());
  app.use(router);
  app.listen(
      port,
      () => chalk.green(console.log(`The api server is running on port: ${port}`))
  );
};

module.exports = {
  name: `--server`,
  run(args) {
    const [count] = args;
    const port = Number.parseInt(count, 10) || DEFAULT_PORT;
    startServer(port);
  }
};
