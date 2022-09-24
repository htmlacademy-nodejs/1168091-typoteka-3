import multer from 'multer';
import path from 'path';
import {nanoid} from 'nanoid';

const currentPath = process.cwd();
const UPLOAD_DIR = `src/express/upload/img`;
const uploadDirAbsolute = path.resolve(currentPath, UPLOAD_DIR);

const FILE_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirAbsolute);
  },
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({storage, fileFilter});
