import express from 'express';
import router from './routes/router.js';
import path from 'path';


const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `src/express/public`;
const UPLOAD_DIR = `src/express/upload`;
const currentPath = process.cwd();


const app = express();

app.use(express.urlencoded({extended: false})); // для расшифровки body при post/put запросах

const publicDirAbsolute = path.resolve(currentPath, PUBLIC_DIR);


// TODO: как он понимает по какому пути обращаться за картинкой???
const uploadDirAbsolute = path.resolve(currentPath, UPLOAD_DIR);

app.use(router);

app.use(express.static(publicDirAbsolute));
app.use(express.static(uploadDirAbsolute));

app.set(`views`, path.resolve(currentPath, `src/express/templates`));
app.set(`view engine`, `pug`);

app.use(function (err, req, res, __next) {
  console.error(err.stack);
  res.status(500).send(`Something broke!`);
});

app.listen(DEFAULT_PORT, () => console.log(`The server is running on port: ${DEFAULT_PORT}`));
