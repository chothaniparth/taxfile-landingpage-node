import Joi from "joi";

// CREATE / UPDATE (POST /dealer)
export const createDealerSchema = Joi.object({
  DealerCguid: Joi.string().max(50).optional().allow(null, ""),
  CityID: Joi.number().integer().allow(null, "").optional(),
  DesignationID: Joi.number().integer().allow(null, "").optional(),
  rCityID: Joi.number().integer().allow(null, "").optional(),
  DealerPartyID: Joi.number().integer().allow(null, "").optional(),
  DOB: Joi.date().allow(null, "").optional(),
  DOJ: Joi.date().allow(null, "").optional(),
  DOA: Joi.date().allow(null, "").optional(),
  BlackListed: Joi.boolean().allow(null, "").optional(),
  DealerName: Joi.string().max(50).optional().allow(null, ""),
  Address1: Joi.string().max(50).allow(null, "").optional(),
  Address2: Joi.string().max(50).allow(null, "").optional(),
  Address3: Joi.string().max(50).allow(null, "").optional(),
  Address4: Joi.string().max(50).allow(null, "").optional(),
  MobileNo: Joi.string().max(10).allow(null, "").optional(),
  rAddress3: Joi.string().max(50).allow(null, "").optional(),
  rAddress4: Joi.string().max(50).allow(null, "").optional(),
  rMobileNo: Joi.string().max(50).allow(null, "").optional(),
  rPhoneNo: Joi.string().max(50).allow(null, "").optional(),
  rFaxNo: Joi.string().max(50).allow(null, "").optional(),
  PhoneNo: Joi.string().max(50).allow(null, "").optional(),
  FirmName: Joi.string().max(50).allow(null, "").optional(),
  FaxNo: Joi.string().max(50).allow(null, "").optional(),
  Email: Joi.string().max(50).allow(null, "").optional(),
  rAddress1: Joi.string().max(50).allow(null, "").optional(),
  rAddress2: Joi.string().max(50).allow(null, "").optional(),
  CustomerID: Joi.string().max(10).allow(null, "").optional(),
  DealerFileCode: Joi.string().max(3).allow(null, "").optional(),
  AcName: Joi.string().max(50).allow(null, "").optional(),
  BankName: Joi.string().max(50).allow(null, "").optional(),
  AcNo: Joi.string().max(20).allow(null, "").optional(),
  IsActive: Joi.boolean().allow(null, "").optional(),
  MobileNo2: Joi.string().max(10).allow(null, "").optional(),
  MobileNo3: Joi.string().max(10).allow(null, "").optional(),
  IsLocalDealer: Joi.boolean().allow(null, "").optional(),
  IsST: Joi.boolean().allow(null, "").optional(),
  FirmID: Joi.number().integer().allow(null, "").optional(),
  dTerms1: Joi.string().max(100).allow(null, "").optional(),
  dTerms2: Joi.string().max(100).allow(null, "").optional(),
  dTerms3: Joi.string().max(100).allow(null, "").optional(),
  BillingFirmID: Joi.number().integer().allow(null, "").optional(),
  opening: Joi.number().integer().allow(null, "").optional(),
  IsPrint: Joi.boolean().allow(null, "").optional(),
  IsIncludeST: Joi.boolean().allow(null, "").optional(),
  GSTNo: Joi.string().max(20).allow(null, "").optional(),
  BankId: Joi.number().integer().allow(null, "").optional(),
  CompanyEmail: Joi.string().max(200).allow(null, "").optional(),
  Password: Joi.string().max(100).allow(null, "").optional(),
  Flag: Joi.string().max(2).allow(null, "").optional(),
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

// DELETE (DELETE /dealer/:DealerCguid)
export const deleteDealerSchema = Joi.object({
  DealerCguid: Joi.number().integer().required(),
});
