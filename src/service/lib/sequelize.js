import * as dotenv from "dotenv";

dotenv.config();

import {Sequelize} from "sequelize";

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some((it) => it === undefined);


if (somethingIsNotDefined) {
  // зачем тут проброс ошибки? Он все равно не ловится в catch в server.js
  throw new Error(`One or more environmental variables are not defined`);
}

export const sequelize = new Sequelize(
    DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      // указываем, с какой СУБД предстоит работать
      dialect: `postgres`,
      // настройки пула соединений
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000
      }
    }
);
