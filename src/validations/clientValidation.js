import Joi from "joi";

// CREATE / UPDATE (POST /client)
export const createClientSchema = Joi.object({
  ClientUkeyId: Joi.string().max(200).required(),
  Companyname: Joi.string().max(400).required(),
  Remarks: Joi.string().max(1000).optional().allow(null, ""),
  Link: Joi.string().max(1000).optional().allow(null, ""),
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

// DELETE (DELETE /client/:ClientUkeyId)
export const deleteClientSchema = Joi.object({
  ClientUkeyId: Joi.string().required(),
});
