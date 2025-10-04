import Joi from "joi";

// CREATE / UPDATE NewsMast
export const createNewsSchema = Joi.object({
  UkeyId: Joi.string().max(200).required(),
  Title: Joi.string().max(1000).required(),
  Descrption: Joi.string().allow(null, "").optional(),
  NewsDate: Joi.date().optional(),
  IsActive: Joi.boolean().default(true),
  IsDeleted: Joi.boolean().default(false),
  UserName: Joi.string().max(100).allow(null, "").optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE NewsMast
export const deleteNewsSchema = Joi.object({
  Id: Joi.number().integer().required(),
});
