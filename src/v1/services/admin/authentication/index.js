import express from 'express';
import validate from 'express-validation';

import { login, register } from '../../../models/admin/user/';
import { loginSchema, registerSchema } from './schema';

const router = express.Router();

router.post('/login', validate(loginSchema), ({ body }, res, next) => {
  const { email, password } = body;
  login(email, password)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

router.post('/register', validate(registerSchema), ({ body }, res, next) => {
  register(body)
    .then(payload => res.status(201).json({ payload }))
    .catch(error => next(error));
});

export default router;
