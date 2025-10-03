import Joi from "joi";

export const createDocMastSchema = Joi.object({
  DocUkeyId: Joi.string().max(200).required(),   // required
  FileName: Joi.string().max(400).required(),    // multer path/filename
  FileType: Joi.string().max(100).required(),
  Master: Joi.string().max(100).required(),
  MasterUkeyId: Joi.string().max(200).required(),
  Link: Joi.string().allow(null, "").optional(), // TEXT, can be null
  IsActive: Joi.boolean().optional(),            // defaults true in DB
  IpAddress: Joi.string().max(200).allow(null, "").optional(),
  EntryDate: Joi.date().optional(),              // Sequelize default NOW
  UserName: Joi.string().max(100).allow(null, "").optional(),

  // updated flag rule (A = add, U = update)
  flag: Joi.string()
    .valid("A", "U")
    .required()
    .messages({
      "any.only": "flag can be A or U only",
      "any.required": "flag is required",
    }),
});
