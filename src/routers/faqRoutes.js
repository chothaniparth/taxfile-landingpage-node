import express from "express";
import {
    createFAQ, getFAQ, deleteFAQ
} from "../controllers/FAQmast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createFAQSchema,
    deleteFAQSchema
} from "../validations/faqValidation.js";

const router = express.Router();

// Public routes
router.get("/", getFAQ);

// Protected routes
router.post("/", authenticateJWT, validate(createFAQSchema), createFAQ);
router.delete("/:FaqUkeyId", authenticateJWT, validate(deleteFAQSchema, 'params'), deleteFAQ);

export default router;