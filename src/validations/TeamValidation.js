import Joi from "joi";

// CREATE / UPDATE (POST /team)
export const createTeamSchema = Joi.object({
  UkeyId: Joi.string().max(200).required(),
  Name: Joi.string().max(400).required(),
  Designation: Joi.string().max(200).required(),
  Links: Joi.string().max(1000).optional().allow(''), // optional links
  IsActive: Joi.boolean().default(true),
  IpAddress: Joi.string().max(200).optional(),
  EntryDate: Joi.date().optional(),
  UserName: Joi.string().max(100).optional(),
  Discription: Joi.string().optional(),
  Type: Joi.string().max(100).optional(),
  INSTA: Joi.string().max(100).optional(),
  TWITER: Joi.string().max(100).optional(),
  YT: Joi.string().max(100).optional(),
  FB: Joi.string().max(100).optional(),
  LinkedIn: Joi.string().max(100).optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /team/:UkeyId)
export const deleteTeamSchema = Joi.object({
  UkeyId: Joi.string().required(),
});
