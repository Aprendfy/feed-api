import express from 'express';
import validate from 'express-validation';

import { createPost } from '../../../models/app/post/';
import { createPostSchema } from './schema';

const router = express.Router();

router.post('/', validate(createPostSchema), ({ body, user }, res, next) => {
  createPost({ ...body, ownerId: user._id })
    .then(payload => res.status(201).json({ payload }))
    .catch(error => next(error));
});

export default router;
