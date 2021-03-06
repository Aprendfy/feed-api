import Joi from 'joi';

export const createPostSchema = {
  body: {
    title: Joi.string().required(),
    category: Joi.string().required(),
    readingTime: Joi.string(),
    level: Joi.string(),
    body: Joi.string().required(),
    image: Joi.string(),
    file: Joi.binary(),
  },
  user: {
    _id: Joi.string().required(),
  },
  options: {
    allowUnknownBody: false,
  },
};

export const updatePostSchema = {
  body: {
    title: Joi.string().required(),
    category: Joi.string().required(),
    readingTime: Joi.string(),
    level: Joi.string(),
    body: Joi.string().required(),
    image: Joi.string(),
    file: Joi.binary(),
  },
  params: {
    postId: Joi.string().required(),
  },
  user: {
    _id: Joi.string().required(),
  },
  options: {
    allowUnknownBody: false,
  },
};

export const getPostsSchema = {
  query: {
    category: Joi.string().required(),
    skip: Joi.number().min(0),
    limit: Joi.number().min(0).max(20),
  },
};

export const getPostSchema = {
  params: {
    postId: Joi.string().required(),
  },
};

export const removePostSchema = {
  params: {
    postId: Joi.string().required(),
  },
};
