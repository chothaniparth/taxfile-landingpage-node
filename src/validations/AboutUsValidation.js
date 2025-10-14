import Joi from "joi";

// CREATE / UPDATE (POST /about-us)
export const createAboutUsSchema = Joi.object({
  AboutUkeyId: Joi.string().max(200).required(),
  LongDetails: Joi.string().optional(),
  Mission: Joi.string().optional(),
  Vision: Joi.string().optional(),
  Core1: Joi.string().optional(),
  Core2: Joi.string().optional(),
  Core3: Joi.string().optional(),
  Core4: Joi.string().optional(),
  Twitter: Joi.string().optional(),
  YT: Joi.string().optional(),
  Linkedin: Joi.string().optional(),
  Insta: Joi.string().optional(),
  FB: Joi.string().optional(),
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