import Joi from 'joi';

export const newCategorySchema = {
  body: {
    name: Joi.string().required(),
    color: Joi.string().required(),
  },
};

export const getCategorySchema = {
  params: {
    categoryId: Joi.string(),
  },
};

export const updateCategorySchema = {
  params: {
    categoryId: Joi.string().required(),
  },
  body: {
    name: Joi.string().required(),
    color: Joi.string().required(),
  },
};

export const removeCategorySchema = {
  params: {
    categoryId: Joi.string().required(),
  },
};

export const getPostsSchema = {
  params: {
    categoryName: Joi.string().required(),
  },
  query: {
    skip: Joi.number().min(0),
    limit: Joi.number().min(0).max(20),
  },
};
