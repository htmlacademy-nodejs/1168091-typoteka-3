'use strict';

const chalk = require(`chalk`);
const {HELP_MESSAGE} = require(`../const`);

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.gray(HELP_MESSAGE));
  }
};
