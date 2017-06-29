import jwt from 'jsonwebtoken';
import expressjwt from 'express-jwt';
import unless from 'express-unless';

import * as Admin from '../models/admin/user';

const secret = process.env.SECRET || 'secret';
export const decodeJWT = expressjwt({ secret, credentialsRequired: false });

decodeJWT.unless = unless;

export function encode(data) {
  return jwt.sign(data, secret);
}

export async function hydrateUser(req, res, next) {
  try {
    if (!req.user) {
      throw Object('Token is either missing or invalid');
    }

    const { _id } = req.user;
    // Search for an user
    const user = await Admin.findById(_id);
    if (user) {
      return next();
    }
    throw Object('Invalid token');
  } catch (e) {
    return next(e);
  }
}

hydrateUser.unless = unless;

