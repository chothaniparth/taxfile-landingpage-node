import Joi from "joi";

// CREATE / UPDATE (POST /about-us)
export const createAboutUsSchema = Joi.object({
  AboutUkeyId: Joi.string().max(200).required(),
  LongDetails: Joi.string().required(),
  Mission: Joi.string().required(),
  Vision: Joi.string().required(),
  Core: Joi.string().required(),
  Counter1: Joi.number().integer().min(0).default(0),
  Counter2: Joi.number().integer().min(0).default(0),
  Counter3: Joi.number().integer().min(0).default(0),
  Counter4: Joi.number().integer().min(0).default(0),
  IpAddress: Joi.string().max(200).optional(),
  EntryDate: Joi.date().optional(),
  UserName: Joi.string().max(100).optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /about-us/:AboutUkeyId)
export const deleteAboutUsSchema = Joi.object({
  AboutUkeyId: Joi.string().required(),
});