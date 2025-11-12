import Joi from "joi";

// CREATE / UPDATE (POST /about-us)
export const createAboutUsSchema = Joi.object({
  email: Joi.string().max(50).required().email(),
});
