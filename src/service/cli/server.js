import {DEFAULT_PORT} from "../const.js";
import router from "../routes/router.js";
import express from "express";
import chalk from "chalk";

const startServer = (port) => {
  const app = express();
  app.use(express.json());
  app.use(router);
  app.listen(port, () =>
    console.log(chalk.green(`The api server is running on port: ${port}`))
  );
};

export default {
  name: `--server`,
  run(args) {
    const [count] = args;
    const port = Number.parseInt(count, 10) || DEFAULT_PORT;
    startServer(port);
  },
};
