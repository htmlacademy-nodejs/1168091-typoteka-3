'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const addZerro = (num) => {
  return `${num}`.length === 1 ? `0${num}` : `${num}`;
};

const createRandomDate = () => {

  const maxDiff = Math.random() * 3 * 60 * 60 * 24 * 30 * 1000;

  const date = new Date(new Date().getTime() - maxDiff);

  const year = date.getFullYear();
  const month = addZerro(date.getMonth() + 1);
  const day = addZerro(date.getDate());
  const hours = addZerro(date.getHours());
  const munutes = addZerro(date.getMinutes());
  const seconds = addZerro(date.getSeconds());


  return `${year}-${month}-${day} ${hours}:${munutes}:${seconds}`;

};


module.exports = {
  getRandomInt,
  shuffle,
  createRandomDate
};
