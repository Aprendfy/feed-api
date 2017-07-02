import Joi from 'joi';

export const newCategorySchema = {
  body: {
    name: Joi.string().required(),
  },
};

export const Schema = {
};
