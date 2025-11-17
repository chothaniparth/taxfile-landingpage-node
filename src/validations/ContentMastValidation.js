import Joi from "joi";

// CREATE / UPDATE (POST /Content-us)
export const createContentSchema = Joi.object({
  
  ContentUkId: Joi.string().max(200).required(),
  ContentTitle: Joi.string().optional().allow("", null),
  ContentDetails: Joi.string().optional().allow("", null),
  IsActive: Joi.boolean().default(true),
  EntryDate: Joi.date().optional(),
  IpAddress: Joi.string().max(200).optional(),
  UserName: Joi.string().max(100).optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

export const deleteContentSchema = Joi.object({
  ContentUkId: Joi.string().required(),
});