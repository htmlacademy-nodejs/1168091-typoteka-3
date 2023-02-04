import {hash as hashBcrypt, hashSync as hashSyncBcrypt, compare} from "bcrypt";

const SALT_ROUNDS = 10;

const hash = (password) => hashBcrypt(password, SALT_ROUNDS);
const hashSync = (password) => hashSyncBcrypt(password, SALT_ROUNDS);

export {
  hash,
  hashSync,
  compare
};
