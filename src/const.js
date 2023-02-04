import {hashSync} from "./service/lib/password.js";

const DEFAULT_COUNT = 1;
const DEFAULT_PORT = 3000;
const MAX_COUNT = 1000;
const MAX_COMMENTS_IN_POST = 5;
const PACKAGE_JSON_PATH = `./package.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const MAX_ID_LENGTH = 6;

const ARTICLES_PER_PAGE = 8;
const DATE_FORMAT = `DD-MM-YYYY`;

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
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const UserRole = {
  AUTHOR: `author`,
  READER: `reader`
};

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: hashSync(`ivanov`),
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`,
    role: UserRole.AUTHOR
  },
  {
    email: `petrov@example.com`,
    passwordHash: hashSync(`petrov`),
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-2.png`,
    role: UserRole.READER
  },
  {
    email: `sidorov@example.com`,
    passwordHash: hashSync(`sidorov`),
    firstName: `Сидр`,
    lastName: `Сидорович`,
    avatar: `avatar-3.png`,
    role: UserRole.READER
  }
];

const testMockData = [
  {
    title: `Рок — это протест`,
    categories: [`Разное`, `Деревья`, `Программирование`, `IT`, `Музыка`],
    user: `sidorov@example.com`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    picture: `item0.jpg`,
    comments: [
      {
        fullText: `Коммент 1-1`,
        user: mockUsers[0].email
      },
      {
        fullText: `Коммент 1-2`,
        user: mockUsers[1].email
      },
      {
        fullText: `Коммент 1-3`,
        user: mockUsers[2].email
      }
    ]
  },
  {
    title: `Что такое золотое сечение`,
    categories: [`Кино`],
    user: `petrov@example.com`,
    announce: `Как начать действовать? Для начала просто соберитесь.`,
    fullText: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения.`,
    picture: `item1.jpg`,
    comments: [
      {
        fullText: `Коммент 2-1`,
        user: mockUsers[1].email
      },
      {
        fullText: `Коммент 2-2`,
        user: mockUsers[0].email
      }
    ]
  },
  {
    title: `Учим HTML и CSS`,
    categories: [`Программирование`, `Железо`],
    user: `ivanov@example.com`,
    announce: `Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    picture: `item2.jpg`,
    comments: [
      {
        fullText: `Коммент 3-1`,
        user: mockUsers[1].email
      }
    ]
  }
];

export {
  DEFAULT_COUNT,
  DEFAULT_PORT,
  MAX_COUNT,
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
  MAX_ID_LENGTH,
  testMockData,
  mockCategories,
  mockUsers,
  UserRole,
  Env,
  ARTICLES_PER_PAGE,
  DATE_FORMAT
};
