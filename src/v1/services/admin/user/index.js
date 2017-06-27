import express from 'express';
import validate from 'express-validation';

import { getUserById, register } from '../../../models/admin/user/';
import { findUserByIdSchema } from './schema';

const router = express.Router();

router.get('/:userId', validate(findUserByIdSchema), ({ params }, res, next) => {
  const { userId } = params;
  getUserById(userId)
    .then(payload => res.status(200).json({ payload, status: 200 }))
    .catch(error => next(error));
});

router.post('/register', ({ body }, res, next) => {
  register(body)
    .then(payload => res.status(200).json({
      message: 'User Criado Com Sucesso',
      payload,
    }))
    .catch(error => next(error));
});

export default router;
