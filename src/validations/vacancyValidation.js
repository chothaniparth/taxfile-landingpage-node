import Joi from "joi";

// CREATE or UPDATE (POST /vacancy)
export const createVacancySchema = Joi.object({
  VacancyUkeyId: Joi.string().max(100).required(), 
  Title: Joi.string().max(200).required(),
  PostedDate: Joi.date().required(),
  NoofPost: Joi.number().integer().min(1).required(),
  Experience: Joi.string().max(200).required(),
  Details: Joi.string().required(), // nvarchar(max)
  IsActive: Joi.boolean().default(true),
  IpAddress: Joi.string().max(200).optional(),
  EntryDate: Joi.date().optional(),
  UserName: Joi.string().max(100).optional(),
  FB: Joi.string().max(100).optional(),
  INSTA: Joi.string().max(100).optional(),
  TWITER: Joi.string().max(100).optional(),
  YT: Joi.string().max(100).optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /vacancy/:Id)
export const deleteVacancySchema = Joi.object({
  VacancyUkeyId: Joi.string().required().max(100),
});
