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
const MAX_ID_LENGTH = 6;

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

const testMockData = [
  {
    "id": `YM07yi`,
    "title": `Учим HTML и CSS`,
    "createdDate": `2022-06-14T06:50:21.888Z`,
    "announce": `Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "category": `За жизнь`,
    "comments": [
      {
        "id": `yzjw9G`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "id": `8u6Rba`,
        "text": `Совсем немного...`
      },
      {
        "id": `5CEc2f`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "id": `6vwmHx`,
        "text": `Это где ж такие красоты?`
      },
      {
        "id": `MeqIwt`,
        "text": `Мне кажется или я уже читал это где-то?`
      }]
  },
  {
    "id": `rZyP5I`,
    "title": `Борьба с прокрастинацией`,
    "createdDate": `2022-06-17T11:37:09.242Z`,
    "announce": `Он написал больше 30 хитов.`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "category": `За жизнь`,
    "comments": []
  },
  {
    "id": `H930wy`,
    "title": `Что такое золотое сечение`,
    "createdDate": `2022-06-05T15:29:07.784Z`,
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "fullText": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха.`,
    "category": `Кино`,
    "comments": [
      {
        "id": `mJZ96q`,
        "text": ``
      },
      {
        "id": `qDylHs`,
        "text": `Плюсую, но слишком много буквы!`
      }
    ]},
  {
    "id": `Q4qpsy`,
    "title": `Что такое золотое сечение`,
    "createdDate": `2022-07-10T12:03:13.524Z`,
    "announce": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "category": `Без рамки`,
    "comments": [
      {
        "id": `-anXwN`,
        "text": `Мне кажется или я уже читал это где-то?`
      }]
  },
  {
    "id": `d68DKL`,
    "title": `Лучшие рок-музыканты 20-века`,
    "createdDate": `2022-07-29T23:24:55.886Z`,
    "announce": `Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Первая большая ёлка была установлена только в 1938 году.`,
    "category": `Разное`,
    "comments": [
      {
        "id": `_vrF3H`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `AcC8rx`,
        "text": `Совсем немного...`
      }]
  }];

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
  MAX_ID_LENGTH,
  testMockData,
  Env
};
