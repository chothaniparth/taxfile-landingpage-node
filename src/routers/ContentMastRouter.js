import express from "express";
import {
    createContent, getContent, deleteContent
} from "../controllers/ContentMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createContentSchema, deleteContentSchema
} from "../validations/ContentMastValidation.js";

const router = express.Router();

// Public routes
router.get("/listContent", getContent);

// Protected routes
router.post("/AddUpdateContent", authenticateJWT, validate(createContentSchema), createContent);
router.delete("/DeleteContent/:ContentUkId", authenticateJWT, validate(deleteContentSchema), deleteContent);

export default router;