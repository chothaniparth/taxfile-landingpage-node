import Joi from "joi";

// CREATE / UPDATE (POST /vacancy-apply)
export const createVacancyApplySchema = Joi.object({
  UkeyId: Joi.string().max(200).required(),
  Name: Joi.string().max(300).required(),
  Mobile: Joi.string()
    .pattern(/^[0-9]{8,24}$/)
    .message("Mobile number must contain only digits and be 8–24 characters long")
    .required(),
  Email: Joi.string().email().max(200).required(),
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

// DELETE (DELETE /vacancy-apply/:UkeyId)
export const deleteVacancyApplySchema = Joi.object({
  UkeyId: Joi.string().required(),
});
