const DEFAULT_COUNT = 1;
const DEFAULT_PORT = 3000;
const MAX_COUNT = 1000;
const MAX_COMMENTS_IN_POST = 5;
const PACKAGE_JSON_PATH = `./package.json`;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const HELP_MESSAGE = `Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
      service.js <command>
      Команды:
      --version:            выводит номер версии
      --help:               печатает этот текст
      --generate <count>    формирует файл mocks.json
      --server <port> запускает http-сервер на порту c номером <port>`;

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

export {
  DEFAULT_COUNT,
  DEFAULT_PORT,
  MAX_COUNT,
  FILE_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  HELP_MESSAGE,
  ExitCode,
  HttpCode,
  MAX_COMMENTS_IN_POST,
  PACKAGE_JSON_PATH,
};
