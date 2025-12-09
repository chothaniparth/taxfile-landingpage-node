import Joi from "joi";

export const createProductCategoryCommissionSchema = Joi.object({
    ProductCategoryCommissionID: Joi.number().integer(),
    CategoryID: Joi.number().integer().optional().allow(null, ""),
    DealerLevelCguid: Joi.string().max(100).optional().allow(null, ""),
    NewSaleCommission: Joi.number().optional().allow(null, ""),
    RenewalCommission: Joi.number().optional().allow(null, ""),
    IsActive: Joi.boolean().default(true),
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
})

export const deleteProductCategoryCommissionSchema = Joi.object({
    ProductCategoryCommissionID: Joi.number().integer().required()
})