import express from 'express';
import validate from 'express-validation';

import { login } from '../../../models/admin/user/';
import { loginSchema } from './schema';

const router = express.Router();

router.post('/login', validate(loginSchema), ({ body }, res, next) => {
  const { email, password } = body;
  login(email, password)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

export default router;
