import Joi from "joi";

// CREATE / UPDATE (POST /partyGroup)
export const createPartyGroupSchema = Joi.object({
  GroupUkeyId: Joi.string().max(200).required(),
  PartyGroupName: Joi.string().max(300).optional().allow(null, ""),
  IsActive: Joi.boolean().optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /partyGroup)
export const deletePartyGroupSchema = Joi.object({
  GroupUkeyId: Joi.string().required(),
});
