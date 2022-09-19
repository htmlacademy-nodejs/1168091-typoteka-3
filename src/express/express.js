import express from 'express';
import router from './routes/router.js';
import path from 'path';


const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `src/express/public`;
const __dirname = path.resolve();


const app = express();

const publicDirAbsolute = path.resolve(__dirname, PUBLIC_DIR);

app.use(router);
app.use(express.static(publicDirAbsolute));

app.set(`views`, path.resolve(__dirname, `src/express/templates`));
app.set(`view engine`, `pug`);

app.use(function (err, req, res, __next) {
  console.error(err.stack);
  res.status(500).send(`Something broke!`);
});

app.listen(DEFAULT_PORT, () => console.log(`The server is running on port: ${DEFAULT_PORT}`));
