import Joi from 'joi';

export const loginSchema = {
  body: {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
  },
};

export const registerSchema = {
  body: {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().valid(['PUBLISHER', 'USER']).required(),
  },
  options: {
    allowUnknownBody: false,
  },
};

