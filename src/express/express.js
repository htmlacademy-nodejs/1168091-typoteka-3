'use strict';

const express = require(`express`);
const router = require(`./routes/router`);


const DEFAULT_PORT = 8080;

const app = express();

app.use(router);

app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(500).send(`Something broke!`);
});

app.listen(DEFAULT_PORT);
