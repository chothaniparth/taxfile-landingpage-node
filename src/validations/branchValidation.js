import Joi from "joi";

// CREATE / UPDATE (POST /branch-mast)
export const createBranchMastSchema = Joi.object({
  BranchUkeyId: Joi.string().max(100).required(),
  BranchName: Joi.string().max(100).required(),
  City: Joi.string().max(100).optional(),
  Add1: Joi.string().max(400).optional(),
  ContactPerson: Joi.string().max(200).optional(),
  Email: Joi.string().email().max(200).optional(),
  Mode: Joi.string().max(100).optional(),
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

// DELETE (DELETE /branch-mast/:BranchId)
export const deleteBranchMastSchema = Joi.object({
  BranchUkeyId: Joi.string().required(),
});
