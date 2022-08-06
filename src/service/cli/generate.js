import {nanoid} from "nanoid";
import chalk from "chalk";
import fs from "fs/promises";
import {getRandomInt, shuffle, createRandomDate} from "../utils.js";
import {
  MAX_COUNT,
  DEFAULT_COUNT,
  FILE_NAME,
  ExitCode,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MAX_COMMENTS_IN_POST,
  MAX_ID_LENGTH
} from "../const.js";

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generatePosts = (count, titles, categories, sentences, comments) => {
  if (count > MAX_COUNT) {
    console.log(chalk.red(`Не больше ${MAX_COUNT} публикаций.`));
    process.exit(ExitCode.ERROR);
  }

  const posts = [];

  for (let i = 0; i < count; i++) {
    posts.push({
      id: nanoid(MAX_ID_LENGTH),
      title: titles[getRandomInt(0, titles.length - 1)],
      createdDate: createRandomDate(),
      announce: sentences[getRandomInt(0, sentences.length - 1)],
      fullText: shuffle(sentences).slice(1, 5).join(` `),
      category: categories[getRandomInt(0, categories.length - 1)],
      comments: new Array(getRandomInt(0, MAX_COMMENTS_IN_POST))
        .fill({})
        .map(() => ({
          id: nanoid(MAX_ID_LENGTH),
          text: comments[getRandomInt(0, comments.length - 1)],
        })),
    });
  }

  return posts;
};

export default {
  name: `--generate`,
  async run(args) {
    const [titles, categories, sentences, comments] = await Promise.all([
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(
        generatePosts(countOffer, titles, categories, sentences, comments)
    );

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.log(chalk.red(`Can't write data to file...`));
    }
  },
};
