'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle, createRandomDate} = require(`../utils`);
const {
  MAX_COUNT,
  DEFAULT_COUNT,
  FILE_NAME,
  ExitCode,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH
} = require(`../const`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generatePosts = (count, titles, categories, sentences) => {

  if (count > MAX_COUNT) {
    console.log(chalk.red(`Не больше ${MAX_COUNT} публикаций.`));
    process.exit(ExitCode.ERROR);
  }

  const posts = [];

  for (let i = 0; i < count; i++) {
    posts.push({
      id: `post-${i}`,
      title: titles[getRandomInt(0, titles.length - 1)],
      createdDate: createRandomDate(),
      announce: sentences[getRandomInt(0, sentences.length - 1)],
      fullText: shuffle(sentences).slice(1, 5).join(` `),
      category: categories[getRandomInt(0, categories.length - 1)]
    });
  }

  return posts;
};

module.exports = {
  name: `--generate`,
  async run(args) {

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePosts(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.log(chalk.red(`Can't write data to file...`));
    }
  }
};
