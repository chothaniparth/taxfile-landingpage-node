import Joi from "joi";

export const createUserSchema = Joi.object({
  UserUkeyId: Joi.string().max(100).optional(),
  Name: Joi.string().max(50).required(),
  Email: Joi.string().email().max(50).required(),
  Mobile1: Joi.string().max(15).required(),
  Mobile2: Joi.string().max(15).optional(),
  Password: Joi.string().min(6).max(50).required(),
});

export const updateUserSchema = Joi.object({
  UserUkeyId: Joi.string().max(100).optional(),
  Name: Joi.string().max(50).optional(),
  Email: Joi.string().email().max(50).optional(),
  Mobile1: Joi.string().max(15).optional(),
  Mobile2: Joi.string().max(15).optional(),
  Password: Joi.string().min(6).max(50).optional(),
});

export const filterUserSchema = Joi.object({
  UserId: Joi.number().integer().optional(),
  UserUkeyId: Joi.string().max(100).optional(),
  Name: Joi.string().max(50).optional(),
  Email: Joi.string().email().max(50).optional(),
  Mobile1: Joi.string().max(15).optional(),
  Mobile2: Joi.string().max(15).optional(),
});
