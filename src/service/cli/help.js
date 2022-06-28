import chalk from "chalk";
import { HELP_MESSAGE } from "../const.js";

export default {
  name: `--help`,
  run() {
    console.info(chalk.gray(HELP_MESSAGE));
  },
};
