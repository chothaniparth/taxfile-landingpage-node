import Joi from "joi";

export const createCarouselSchema = Joi.object({
  UkeyId: Joi.string().max(100).required(),
  Title: Joi.string().max(50).allow(null, ""),
  Name: Joi.string().max(50).allow(null, ""),
  IsDoc: Joi.boolean(),
  IsActive: Joi.boolean(),
  OrderId: Joi.number().integer().optional(),
  UserName: Joi.string().max(15).allow(null, ""),

  // updated flag rule
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// export const updateCarouselSchema = Joi.object({
//   UkeyId: Joi.string().max(100).optional(),
//   Title: Joi.string().max(50).required(),
//   Name: Joi.string().email().max(50).required(),
//   Mobile1: Joi.string().max(15).required(),
//   Mobile2: Joi.string().max(15).allow(null, ""),
//   CarouselName: Joi.string().max(15).allow(null, ""),
//   CustId: Joi.string().max(15).allow(null, ""),
//   Password: Joi.string().min(6).max(50).required(),
//   IsActive: Joi.boolean(),
// });