import Joi from "joi";

// CREATE (POST /subcategories)
export const createSubCategorySchema = Joi.object({
  SubUkeyId: Joi.string().max(200).required(),
  SubCateName: Joi.string().max(200).required(),
  CategoryId: Joi.number().integer().required(),
  IsActive: Joi.boolean().default(true),
  IpAddress: Joi.string().max(200).optional(),
  EntryDate: Joi.date().optional(),
  UserName: Joi.string().max(100).optional(),
  flag: Joi.string().max(4).optional(),
});

// DELETE (DELETE /subcategories/:id)
export const deleteSubCategorySchema = Joi.object({
  SubUkeyId: Joi.string().required(),
});