'use strict';

const express = require(`express`);
const router = require(`./routes/router`);
const path = require(`path`);


const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.use(router);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(function (err, req, res, __next) {
  console.error(err.stack);
  res.status(500).send(`Something broke!`);
});

app.listen(DEFAULT_PORT, () => console.log(`The server is running on port: ${DEFAULT_PORT}`));
