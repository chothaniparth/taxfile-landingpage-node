import Joi from "joi";

// CREATE / UPDATE (POST /imp-dates)
export const createBirthdaySchema = Joi.object({
  id: Joi.number().integer(),
  Name: Joi.string().max(400).required(),
  RelationId: Joi.number().integer().optional().allow(null, ""),
  Mobile: Joi.string().max(100).optional().allow(null, ""),
  Email: Joi.string().max(200).optional().allow(null, ""),
  Birthday: Joi.date().optional().allow(null, ""),
  Anniversary: Joi.date().optional().allow(null, ""),
  PartyId: Joi.number().integer().required(),
  IsActive: Joi.boolean().default(true),
  RegionID: Joi.string().max(50).optional().allow(null, ""),
  Degree : Joi.string().max(100).optional().allow(null, ""),
  Flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "Flag can be A or U only",
      "any.required": "Flag is required",
    }),
});

export const deleteBirthdaySchema = Joi.object({
  id: Joi.number().integer().required()
})