import Joi from "joi";

// CREATE / UPDATE (POST /dealerCustomCommission)
export const createDealerCustomCommissionSchema = Joi.object({
  DealerCustomCommissionID: Joi.number().optional().allow(null),
  DealerCguid: Joi.string().max(200).required(),
  ProductCguid: Joi.string().max(200).required(),
  NewSaleCommission: Joi.number().precision(2).allow(null, "").optional(),
  RenewalCommission: Joi.number().precision(2).allow(null, "").optional(),
  IsActive: Joi.boolean().allow(null, "").optional(),
  IpAddress: Joi.string().max(200).allow(null, "").optional(),
  EntryDate: Joi.date().allow(null, "").optional(),
  UserName: Joi.string().max(100).allow(null, "").optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /dealerCustomCommission/:DealerCustomCommissionID)
export const deleteDealerCustomCommissionSchema = Joi.object({
  DealerCustomCommissionID: Joi.number().integer().required(),
});
