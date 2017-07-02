import express from 'express';
import validate from 'express-validation';

import { create } from '../../../models/app/category/';
import { newCategorySchema } from './schema';

const router = express.Router();

router.post('/', validate(newCategorySchema), ({ body }, res, next) => {
  create(body)
    .then(payload => res.status(201).json({
      message: 'Categoria Criado com Sucesso',
      payload,
    }))
    .catch(error => next(error));
});

export default router;
