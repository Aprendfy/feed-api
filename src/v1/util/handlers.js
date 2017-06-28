import { ValidationError } from 'express-validation';
import * as messages from '../config/messages';

export function validationError(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(422).json({
      message: messages.VALIDATION_ERROR,
      payload: err.errors,
      status: 422,
    });
  }
  return next(err);
}

export function internalError(err, req, res, next) {
  return res.status(err.status || 500).json({
    payload: err.payload ? {} : err,
    status: err.status || 500,
    message: err.message || messages.INTERNAL_ERROR,
  });
}
