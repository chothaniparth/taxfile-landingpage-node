import Joi from "joi";

// CREATE / UPDATE (POST /team)
export const createTransaction = Joi.object({
  Master:  Joi.object({
    TransactionUkeyId: Joi.string().max(200).required(),
    InvoiceNo: Joi.string().max(200).optional(),
    InvoiceDate: Joi.date().allow('', null),
    PartyID: Joi.number().allow(null),
    DealerCguid: Joi.string().max(200).required(),
    TxnType: Joi.string().max(200).required(),
    AmountExGST: Joi.number().allow(null),
    GSTAmount: Joi.number().allow(null),
    GrossAmount: Joi.number().allow(null),
  }),
  TransactionProduct: Joi.array().items(
    Joi.object({
      TransactionUkeyId: Joi.string().allow('', null).optional(),
      ProductCguid : Joi.string().max(100).optional('', null),
      CategoryID: Joi.number().allow('', null).optional(),
      Quantity: Joi.number().allow('', null).optional(),
      Rate: Joi.number().allow('', null).optional(),
      AmountExGST: Joi.number().allow('', null).optional(),
      GSTAmount: Joi.number().allow('', null).optional(),
      GrossAmount: Joi.number().allow('', null).optional(),
      Remarks: Joi.string().max(200).optional('', null),
    })
  ).optional(),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /team/:UkeyId)
export const deleteTransactionSchema = Joi.object({
  TransactionUkeyId: Joi.string().required(),
});

export const managePaymentSchema = Joi.object({
  Mode : Joi.string().optional().max(50).allow(null, ''),
  PeriodStart : Joi.date().optional(),
  PeriodEnd : Joi.date().optional(),
  PayoutCguid : Joi.string().optional().max(100).allow(null, ''),
  PaymentReferencePrefix : Joi.string().optional().max(50).allow(null, ''),
})