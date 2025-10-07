import express from "express";
import {
    getInquiries, createInquiry, deleteInquiry
} from "../controllers/InquiryMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createInquirySchema, deleteInquirySchema
} from "../validations/InqueryValidation.js";

const router = express.Router();

// Public routes
router.get("/inqueryList", getInquiries);

// Protected routes
router.post("/AddUpdateInquery", authenticateJWT, validate(createInquirySchema), createInquiry);
router.delete("/deleteInquery/:UkeyId", authenticateJWT, validate(deleteInquirySchema), deleteInquiry);

export default router;