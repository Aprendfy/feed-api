import jwt from 'jsonwebtoken';
import expressjwt from 'express-jwt';
import unless from 'express-unless';

const secret = process.env.SECRET || 'secret';
export const decodeJWT = expressjwt({ secret, credentialsRequired: false });

decodeJWT.unless = unless;

export function encode(data) {
  return jwt.sign(data, secret);
}
