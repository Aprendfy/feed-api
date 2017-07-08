import express from 'express';
import validate from 'express-validation';
import multer from 'multer';

import { createPost, updatePost, getPosts, getPost } from '../../../models/app/post/';
import { createPostSchema, updatePostSchema, getPostsSchema, getPostSchema } from './schema';

const router = express.Router();

const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: '1mb', files: 1 },
});


router.post('/', upload.single('file'), validate(createPostSchema), ({ body, user, file }, res, next) => {
  createPost({ ...body, ownerId: user._id }, file)
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
