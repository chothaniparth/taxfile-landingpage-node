import Joi from "joi";

export const createProductSchema = Joi.object({
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag must be either 'A' (Add) or 'U' (Update)",
      "any.required": "flag is required",
    }),

  Master: Joi.object({
    ProductUkeyId: Joi.string().max(200).required(),
    ProductName: Joi.string().max(400).required(),
    ShortCode: Joi.string().max(50).optional(),
    CategoryId: Joi.number().integer().required(),
    SubUkeyId: Joi.string().max(200).optional(),
    Tagline1: Joi.string().max(500).optional(),
    Tagline2: Joi.string().max(500).optional(),
    IsActive: Joi.boolean().required(),
    IsDeleted: Joi.boolean().required(),
    HSNCode: Joi.string().max(100).optional(),
    OrderId: Joi.number().integer().optional(),
    ProductWebsite: Joi.string().max(500).optional(),
  })
    .required()
    .messages({
      "any.required": "Master object is required",
    }),

  price: Joi.array()
    .items(
      Joi.object({
        PriceUkeyId: Joi.string().max(200).required(),
        ProductUkeyId: Joi.string().max(200).required(),
        SingleUser: Joi.number().precision(2).required(),
        MultiUser: Joi.number().precision(2).required(),
        UpdateSingle: Joi.number().precision(2).optional(),
        Updatemulti: Joi.number().precision(2).optional(),
        IsActive: Joi.boolean().required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one price record is required",
      "any.required": "price array is required",
    }),

  content: Joi.array()
    .items(
      Joi.object({
        ContentUkeyId: Joi.string().max(200).required(),
        ProductUkeyId: Joi.string().max(200).required(),
        Details: Joi.string().required(),
        IsActive: Joi.boolean().required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one content record is required",
      "any.required": "content array is required",
    }),
});

// DELETE (DELETE /about-us/:AboutUkeyId)
export const deleteProductSchema = Joi.object({
  ProductUkeyId: Joi.string().required(),
});