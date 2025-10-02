import Joi from "joi";

export const createUserSchema = Joi.object({
  UserUkeyId: Joi.string().max(100).optional(),
  Name: Joi.string().max(50).required(),
  Email: Joi.string().email().max(50).required(),
  Mobile1: Joi.string().max(15).required(),
  Mobile2: Joi.string().max(15).allow(null, ""),
  UserName: Joi.string().max(15).allow(null, ""),
  CustId: Joi.string().max(15).allow(null, ""),
  Password: Joi.string().min(6).max(50).required(),
  IsActive: Joi.boolean(),
});

export const updateUserSchema = Joi.object({
  UserUkeyId: Joi.string().max(100).optional(),
  Name: Joi.string().max(50).required(),
  Email: Joi.string().email().max(50).required(),
  Mobile1: Joi.string().max(15).required(),
  Mobile2: Joi.string().max(15).allow(null, ""),
  UserName: Joi.string().max(15).allow(null, ""),
  CustId: Joi.string().max(15).allow(null, ""),
  Password: Joi.string().min(6).max(50).required(),
  IsActive: Joi.boolean(),
});