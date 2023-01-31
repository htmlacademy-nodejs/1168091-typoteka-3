import {hash, hashSync} from "bcrypt";

const SALT_ROUNDS = 10;

export default {
  hash: (password) => hash(password, SALT_ROUNDS),
  hashSync: (password) => hashSync(password, SALT_ROUNDS)
};
