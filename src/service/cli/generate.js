'use strict';

const fs = require(`fs`);
const {getRandomInt, shuffle, createRandomDate} = require(`../utils`);
const {MAX_COUNT, TITLES, ANONSES, CATEGORIES, DEFAULT_COUNT, FILE_NAME, ExitCode} = require(`../const`);


const generatePosts = (count) => {
  if (count > MAX_COUNT) {
    console.info(`Не больше ${MAX_COUNT} публикаций.`);
    process.exit(ExitCode.ERROR);
  }

  const posts = [];

  for (let i = 0; i < count; i++) {
    posts.push({
      id: `post-${i}`,
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      createdDate: createRandomDate(),
      announce: ANONSES[getRandomInt(0, ANONSES.length - 1)],
      fullText: shuffle(ANONSES).slice(1, 5).join(` `),
      category: CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]
    });
  }

  return posts;
};

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePosts(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  }
};
