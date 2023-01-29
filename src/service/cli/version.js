import chalk from "chalk";
import fs from "fs/promises";
import {PACKAGE_JSON_PATH} from "../../const.js";

export default {
  name: `--version`,
  async run() {
    const content = await fs.readFile(PACKAGE_JSON_PATH);
    const {version} = JSON.parse(content);
    console.info(chalk.blue(version));
  },
};
