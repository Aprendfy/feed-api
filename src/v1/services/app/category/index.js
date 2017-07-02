import express from 'express';
import validate from 'express-validation';

import { create, update, remove, findByIdOrFindAll } from '../../../models/app/category/';
import {
  newCategorySchema,
  getCategorySchema,
  updateCategorySchema,
  removeCategorySchema,
} from './schema';

const router = express.Router();

router.post('/', validate(newCategorySchema), ({ body }, res, next) => {
  create(body)
    .then(payload => res.status(201).json({ payload }))
    .catch(error => next(error));
});

router.get('/:categoryId?', validate(getCategorySchema), ({ params }, res, next) => {
  const { categoryId } = params;
  findByIdOrFindAll(categoryId)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

router.put('/:categoryId', validate(updateCategorySchema), ({ body, params }, res, next) => {
  const { categoryId } = params;

  update(body, categoryId)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

router.delete('/:categoryId', validate(removeCategorySchema), ({ params }, res, next) => {
  const { categoryId } = params;
  remove(categoryId)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

export default router;
