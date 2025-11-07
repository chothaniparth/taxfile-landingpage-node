import Joi from "joi";

// CREATE / UPDATE (POST /branch-mast)
export const createBranchMastSchema = Joi.object({
  BranchUkeyId: Joi.string().max(100).required(),
  BranchName: Joi.string().max(100).required(),
  City: Joi.string().max(100).optional().allow(null, ""),
  Add1: Joi.string().max(400).optional().allow(null, ""),
  ContactPerson: Joi.string().max(200).optional().allow(null, ""),
  Email: Joi.string().email().max(200).optional().allow(null, ""),
  Mode: Joi.string().max(100).optional().allow(null, ""),
  IsActive: Joi.boolean().default(true).allow(null, ""),
  IpAddress: Joi.string().max(200).optional().allow(null, ""),
  EntryDate: Joi.date().optional().allow(null, ""),
  UserName: Joi.string().max(100).optional().allow(null, ""),
  Link: Joi.string().max(500).optional().allow(null, ""),
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
