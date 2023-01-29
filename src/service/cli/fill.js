import chalk from "chalk";
import fs from "fs/promises";
import {getRandomInt, shuffle, readContent} from "../../utils.js";

import {
  DEFAULT_COUNT,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MAX_COMMENTS_IN_POST,
  UserRole
} from "../../const.js";

const FILE_NAME = `./fill-db.sql`;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`,
    role: UserRole.AUTHOR
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`,
    role: UserRole.GUEST
  },
  {
    email: `sidorov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Сидр`,
    lastName: `Сидорович`,
    avatar: `avatar3.jpg`,
    role: UserRole.READER
  }
];

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateArticles = (count, titles, sentences, userCount) => (
  Array.from({length: count}, () => (
    {
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: sentences[getRandomInt(0, sentences.length - 1)],
      fullText: shuffle(sentences).slice(1, 5).join(` `),
      picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
      userId: getRandomInt(1, userCount)
    }
  ))
);

const generateComments = (count, articleId, userCount, comments) => (
  Array.from({length: count}, () => (
    {
      fullText: shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `),
      articleId,
      userId: getRandomInt(1, userCount)
    }
  ))
);

export default {
  name: `--fill`,
  async run(args) {
    const [titles, categories, sentences, comments] = await Promise.all([
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const [count] = args;
    const articleCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const articles = generateArticles(articleCount, titles, sentences, users.length);

    const allComments = articles.flatMap((_, idx) => {
      return generateComments(getRandomInt(1, MAX_COMMENTS_IN_POST), idx + 1, users.length, comments);
    });

    const articleCategory = categories.map(() => {
      return {
        articlesId: getRandomInt(1, articleCount),
        categoriesId: getRandomInt(1, categories.length)
      };
    });

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar, role}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}', '${role}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(({title, announce, fullText, picture, userId}) =>
      `('${title}', '${announce}', '${fullText}', '${picture}', '${userId}')`).join(`,\n`);

    const commentValues = allComments.map(
        ({fullText, articleId, userId}) => `('${fullText}', '${articleId}', '${userId}')`).join(`,\n`);

    const articlesCategoriesValue = articleCategory.map(({articlesId, categoriesId}) => `('${articlesId}', '${categoriesId}')`).join(`,\n`);


    const content =
`INSERT INTO users(email, password_hash, first_name, last_name, avatar, role) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(articles_id, categories_id) VALUES
${articlesCategoriesValue};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(full_text, article_id, user_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};


// npm run start -- --fill
