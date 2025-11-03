import Joi from "joi";

// CREATE / UPDATE (POST /inquiry)
export const createInquirySchema = Joi.object({
  UkeyId: Joi.string().max(200).required(),
  ProductUkeyId: Joi.string().max(200).required(),
  inquiryMode: Joi.string().max(100).required(),
  Name: Joi.string().max(300).required(),
  CompanyName: Joi.string().max(300).required(),
  Address: Joi.string().max(800).optional().allow("", null),
  City: Joi.string().max(100).optional().allow("", null),
  State: Joi.string().max(100).optional().allow("", null),
  PinCode: Joi.string().max(20).optional().allow("", null),
  Email: Joi.string().email().max(200).required(),
  Mobile: Joi.string().max(24).optional().allow("", null),
  Message: Joi.string().max(1000).required(),
  IsActive: Joi.boolean().default(true),
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

// DELETE (DELETE /inquiry/:UkeyId)
export const deleteInquirySchema = Joi.object({
  UkeyId: Joi.string().required(),
});
