import Joi from "joi";

// CREATE or UPDATE (POST /ytvideos OR PUT /ytvideos/:UkeyId)
export const createOrUpdateYTvideoSchema = Joi.object({
  UkeyId: Joi.string().max(200).required(),
  ProductUkeyId: Joi.string().max(200).required(),
  URL: Joi.string().uri().max(1000).required(), // URL validation
  IsActive: Joi.boolean().default(true),
  IpAddress: Joi.string().max(200).optional(),
  EntryDate: Joi.date().optional(),
  UserName: Joi.string().max(100).optional(),

  // updated flag rule (A = add, U = update)
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /ytvideos/:UkeyId)
export const deleteYTvideoSchema = Joi.object({
  UkeyId: Joi.string().required(),
});