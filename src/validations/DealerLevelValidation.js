import Joi from "joi";

// CREATE / UPDATE (POST /dealerLevel)
export const createDealerLevelSchema = Joi.object({
  Cguid: Joi.string().max(200).allow(null, "").optional(),
  LevelName: Joi.string().max(200).required(),
  CommissionPercentNew: Joi.number().precision(2).required(),
  CommissionPercentRenew: Joi.number().precision(2).required(),
  OverridePercent: Joi.number().precision(2).allow(null, "").optional(),
  TargetAmount: Joi.number().precision(2).allow(null, "").optional(),
  Notes1: Joi.string().max(2000).allow(null, "").optional(),
  Notes2: Joi.string().max(2000).allow(null, "").optional(),
  IpAddress: Joi.string().max(100).allow(null, "").optional(),
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

// DELETE (DELETE /dealerLevel/:DealerLevelId)
export const deleteDealerLevelSchema = Joi.object({
  Cguid: Joi.string().required(),
});
