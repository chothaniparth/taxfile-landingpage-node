import Joi from "joi";

// CREATE / UPDATE (POST /imp-dates)
export const createImpDatesSchema = Joi.object({
  UkeyId: Joi.string().required(),
  Name: Joi.string().max(400).required(),
  ImpDate: Joi.date().required(),
  Description: Joi.string().optional(),
  IsActive: Joi.boolean().default(true),
  IpAddress: Joi.string().max(200).optional(),
  EntryDate: Joi.date().optional(),
  UserName: Joi.string().max(100).optional(),
  Links: Joi.string().max(500).optional().allow(null, ''),
  Mode: Joi.string().max(50).optional().allow(null, ''),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /imp-dates/:Id)
export const deleteImpDatesSchema = Joi.object({
  UkeyId: Joi.string().required(),
});
