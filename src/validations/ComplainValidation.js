import Joi from "joi";

// CREATE / UPDATE (POST /complaint)
export const createComplaintSchema = Joi.object({
  ComplaintUkeyId: Joi.string().max(200).required(),
  PartyName: Joi.string().max(100).optional().allow(null, ""),
  ComplaintBy: Joi.string().max(100).optional().allow(null, ""),
  ContactNo: Joi.string().max(30).optional().allow(null, ""),
  VisitingHours: Joi.string().max(40).optional().allow(null, ""),
  Query: Joi.string().optional().allow(null, ""), // NVARCHAR(MAX)
  IpAddress: Joi.string().max(100).optional().allow(null, ""),
  UserName: Joi.string().max(100).optional().allow(null, ""),
  InqueryCallDate: Joi.string().max(100).optional().allow(null, ""),
  ProductUkeyId: Joi.string().max(100).optional().allow(null, ""),
  CustomerID: Joi.string().max(100).optional().allow(null, ""),
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});

// DELETE (DELETE /complaint/:ComplaintUkeyId)
export const deleteComplaintSchema = Joi.object({
  ComplaintUkeyId: Joi.string().required(),
});
