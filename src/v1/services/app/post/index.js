import express from 'express';
import validate from 'express-validation';

import { createPost, updatePost } from '../../../models/app/post/';
import { createPostSchema, updatePostSchema } from './schema';

const router = express.Router();

router.post('/', validate(createPostSchema), ({ body, user }, res, next) => {
  createPost({ ...body, ownerId: user._id })
    .then(payload => res.status(201).json({ payload }))
    .catch(error => next(error));
});

router.put('/:postId', validate(updatePostSchema), ({ body, params, user }, res, next) => {
  const { postId } = params;
  updatePost(user, postId, body)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

export default router;
