import express from 'express';
import validate from 'express-validation';

import { createPost, updatePost, getPosts, getPost } from '../../../models/app/post/';
import { createPostSchema, updatePostSchema, getPostsSchema, getPostSchema } from './schema';

const router = express.Router();

router.post('/', validate(createPostSchema), ({ body, user }, res, next) => {
  createPost({ ...body, ownerId: user._id })
    .then(payload => res.status(201).json({ payload }))
    .catch(error => next(error));
});

router.get('/:postId', validate(getPostSchema), ({ params }, res, next) => {
  const { postId } = params;
  getPost(postId)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

router.put('/:postId', validate(updatePostSchema), ({ body, params, user }, res, next) => {
  const { postId } = params;
  updatePost(user, postId, body)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

router.get('/', validate(getPostsSchema), ({ query }, res, next) => {
  const { category, skip, limit } = query;
  getPosts(category, skip, limit)
    .then(payload => res.status(200).json({ payload }))
    .catch(error => next(error));
});

export default router;
