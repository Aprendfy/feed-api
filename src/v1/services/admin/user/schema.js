import Joi from 'joi';

export const findUserByIdSchema = {
  params: {
    id: Joi.string()
  },
};
