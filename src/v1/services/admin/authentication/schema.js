import Joi from 'joi';

export const loginSchema = {
  body: {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
  },
};
