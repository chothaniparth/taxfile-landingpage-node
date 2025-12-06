import Joi from "joi";

// CREATE (POST /faqs)
export const createFAQSchema = Joi.object({
  FaqUkeyId: Joi.string().max(200).required(),
  Type: Joi.string().max(100).required(),
  Ques: Joi.string().max(1000).required(),
  Ans: Joi.string().max(1000).required(),
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
  
// DELETE (DELETE /faqs/:FaqUkeyId)
export const deleteFAQSchema = Joi.object({
  FaqUkeyId: Joi.string().required(),
});