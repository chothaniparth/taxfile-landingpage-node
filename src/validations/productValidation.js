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
    Tagline2: Joi.string().max(500).optional().allow(null, ""),
    IsActive: Joi.boolean().required(),
    IsDeleted: Joi.boolean().required(),
    HSNCode: Joi.string().max(100).optional().allow(null, ""),
    OrderId: Joi.number().integer().optional().allow(null),
    ProductWebsite: Joi.string().max(500).optional().allow(null, ""),
    crmProductUkeyId: Joi.string().max(100).optional().allow(null, ""),
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
        SingleUser: Joi.string().allow(null, "").optional(),
        MultiUser: Joi.string().allow(null, "").optional(),
        UpdateSingle: Joi.string().allow(null, "").optional(),
        Updatemulti: Joi.string().allow(null, "").optional(),
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
        Title: Joi.string().max(100).optional().allow(null, ""),
        Details: Joi.string().required(),
        IsActive: Joi.boolean().required(),
      })
    )
    .optional()
    // .min(1)
    // .messages({
    //   "array.min": "At least one content record is required",
    //   "any.required": "content array is required",
    // }),
});

// DELETE (DELETE /about-us/:AboutUkeyId)
export const deleteProductSchema = Joi.object({
  ProductUkeyId: Joi.string().required(),
});