import express from 'express';
import methodOverride from 'method-override';
import session from "express-session";
import * as dotenv from "dotenv";
import {sequelize} from "../service/lib/sequelize.js";
import connectSessionSequelize from 'connect-session-sequelize';
import router from './routes/router.js';
import path from 'path';
import {HttpCode} from '../const.js';

dotenv.config();

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `src/express/public`;
const UPLOAD_DIR = `src/express/upload`;
const currentPath = process.cwd();

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const SequelizeStore = connectSessionSequelize(session.Store);

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 60 * 60 * 1000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});


app.use(express.urlencoded({extended: false})); // для расшифровки body при post/put запросах

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(methodOverride((req) => {
  if (req.body && typeof req.body === `object` && `_method` in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
  return ``;
}));

const publicDirAbsolute = path.resolve(currentPath, PUBLIC_DIR);


// TODO: как он понимает по какому пути обращаться за картинкой???
const uploadDirAbsolute = path.resolve(currentPath, UPLOAD_DIR);

app.use(router);

app.use(express.static(publicDirAbsolute));
app.use(express.static(uploadDirAbsolute));

app.set(`views`, path.resolve(currentPath, `src/express/templates`));
app.set(`view engine`, `pug`);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).render(`errors/404`));

app.use(function (err, req, res, __next) {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(DEFAULT_PORT, () => console.log(`The server is running on port: ${DEFAULT_PORT}`));
