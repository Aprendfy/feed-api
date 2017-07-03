import bcrypt from 'bcryptjs';
import Promise from 'bluebird';

const saltRounds = 10;

export const hash = Promise.promisify(
  (password, cb) => bcrypt.hash(password, saltRounds, cb),
);

export const compare = Promise.promisify(
  bcrypt.compare,
);
