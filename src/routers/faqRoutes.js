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
router.get("/faqList", getFAQ);

// Protected routes
router.post("/addUpdateFaq", authenticateJWT, validate(createFAQSchema), createFAQ);
router.delete("/deleteFaq/:FaqUkeyId", authenticateJWT, validate(deleteFAQSchema, 'params'), deleteFAQ);

export default router;