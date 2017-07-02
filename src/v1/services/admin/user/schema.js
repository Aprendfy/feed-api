import Joi from 'joi';

export const findUserByIdSchema = {
  params: {
    id: Joi.string(),
  },
};

export const updateUserSchema = {
  body: {
    name: Joi.string(),
    email: Joi.string().email(),
    type: Joi.string().valid('ADIM', 'PUBLISHER', 'USER'),
    avatar: Joi.string(),
    facebook: Joi.string(),
    twitter: Joi.string(),
    gplus: Joi.string(),
    linkedin: Joi.string(),
    userStatus: Joi.string().valid('PENDING', 'REQUESTED', 'ACCEPTED', 'DENIED', 'BLOCKED'),
    userId: Joi.string(),
  },

};

export const registerSchema = {

};

