import Joi from "joi";

// CREATE / UPDATE (POST /dealerSection)
export const createDealerSectionSchema = Joi.object({
  Cguid: Joi.string().max(200).allow(null, "").required(),
  Sectiontype: Joi.string().max(200).allow(null, "").optional(),
  Dealerlevelcguid: Joi.string().max(200).allow(null, "").optional(),
  Notes: Joi.string().allow(null, "").optional(),
  IsActive: Joi.boolean().allow(null, "").optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /dealerSection/:Id)
export const deleteDealerSectionSchema = Joi.object({
  Id: Joi.number().integer().required(),
});
