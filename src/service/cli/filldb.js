
import chalk from "chalk";

import {getRandomInt, shuffle, readContent} from "../utils.js";
import {
  MAX_COUNT,
  DEFAULT_COUNT,
  ExitCode,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MAX_COMMENTS_IN_POST,
  UserRole
} from "../const.js";

import {sequelize} from "../lib/sequelize.js";

import {getLogger} from "../lib/logger.js";
import initDb from "../lib/init-db.js";

const logger = getLogger({name: `api`});

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};


const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateComments = (count, users, comments) => (
  Array.from({length: count}, () => (
    {
      fullText: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
      user: users[getRandomInt(0, users.length - 1)].email
    }
  ))
);

const getPictureFileName = () => `item${getRandomInt(0, 2)}.jpg`;

const generateArticles = (count, titles, sentences, categories, comments, users) => {
  if (count > MAX_COUNT) {
    console.log(chalk.red(`Не больше ${MAX_COUNT} публикаций.`));
    process.exit(ExitCode.ERROR);
  }

  return Array.from({length: count}, () => (
    {
      categories: getRandomSubarray(categories),
      user: users[getRandomInt(0, users.length - 1)].email,
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: sentences[getRandomInt(0, sentences.length - 1)],
      fullText: shuffle(sentences).slice(1, 5).join(` `),
      picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS_IN_POST), users, comments)
    }
  ));
};

export default {
  name: `--filldb`,
  async run(args) {
    const [titles, categories, sentences, comments] = await Promise.all([
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar-1.png`,
        role: UserRole.AUTHOR
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar-2.png`,
        role: UserRole.GUEST
      },
      {
        email: `sidorov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Сидр`,
        lastName: `Сидорович`,
        avatar: `avatar-3.png`,
        role: UserRole.READER
      }
    ];

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const articles = generateArticles(countOffer, titles, sentences, categories, comments, users);

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);


    return initDb(sequelize, {users, categories, articles});
  },
};
