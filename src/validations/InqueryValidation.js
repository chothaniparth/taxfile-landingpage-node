import Joi from "joi";

// CREATE / UPDATE (POST /inquiry)
export const createInquirySchema = Joi.object({
  UkeyId: Joi.string().max(200).required(),
  ProductUkeyId: Joi.string().max(200).optional().allow("", null),
  inquiryMode: Joi.string().max(100).optional().allow("", null),
  Name: Joi.string().max(300).optional().allow("", null),
  CompanyName: Joi.string().max(300).optional().allow("", null),
  Address: Joi.string().max(800).optional().allow("", null),
  City: Joi.string().max(100).optional().allow("", null),
  State: Joi.string().max(100).optional().allow("", null),
  PinCode: Joi.string().max(20).optional().allow("", null),
  Status: Joi.string().max(20).optional().allow("", null),
  Email: Joi.string().email().max(200).required(),
  Mobile: Joi.string().max(24).optional().allow("", null),
  Message: Joi.string().max(1000).required(),
  IsActive: Joi.boolean().default(true),
  IpAddress: Joi.string().max(200).optional(),
  EntryDate: Joi.date().optional(),
  UserName: Joi.string().max(100).optional(),
  EstablishmentYear: Joi.string().max(500).optional().allow("", null),
  PAN: Joi.string().max(500).optional().allow("", null),
  GST: Joi.string().max(500).optional().allow("", null),
  ContactPerson: Joi.string().max(500).optional().allow("", null),
  Remark1: Joi.string().max(500).optional().allow("", null),
  Remark2: Joi.string().max(500).optional().allow("", null),
  Remark3: Joi.string().max(500).optional().allow("", null),
  Remark4: Joi.string().max(500).optional().allow("", null),
  Remark5: Joi.string().max(500).optional().allow("", null),
  Remark6: Joi.string().max(500).optional().allow("", null),
  Subject: Joi.string().max(500).optional().allow("", null),
  ExpStartDate: Joi.date().optional().allow("", null),
  Industry: Joi.string().max(500).optional().allow("", null),
  ExpBudget: Joi.number().optional().allow("", null),
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
