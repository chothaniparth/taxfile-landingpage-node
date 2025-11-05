import Joi from 'joi';

export const createCategorySchema = Joi.object({
    CategoryId : Joi.number().integer().optional(),
    CategoryName : Joi.string().max(100).required(),
    IsActive : Joi.boolean().required(),

    // updated flag rule
    flag: Joi.string()
      .valid("A", "U")
      .required()
      .messages({
        "any.only": "flag can be A or U only",
        "any.required": "flag is required",
    }),
});