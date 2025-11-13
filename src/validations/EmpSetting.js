import Joi from "joi";

export const createEmpSettingSchema = Joi.object({
  CRMEmpIds: Joi.array()
    .items(Joi.string().max(200).required())
    .min(1)
    .required()
    .messages({
      "array.base": "CRMEmpId must be an array of strings",
      "array.min": "At least one CRMEmpId is required",
    }),

  Mode: Joi.string().max(100).required().messages({
    "any.required": "Mode is required",
  }),

  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),

  ColumnId: Joi.string().max(200).optional(),
  EntryDate: Joi.date().optional(),
});


// DELETE (DELETE /about-us/:AboutUkeyId)
export const deleteAboutUsSchema = Joi.object({
  AboutUkeyId: Joi.string().required(),
});