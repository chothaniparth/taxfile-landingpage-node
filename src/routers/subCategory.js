import express from "express";
import {
    createSubCategory, getSubCategory, deleteSubCategory
} from "../controllers/subCategory.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createSubCategorySchema,
    deleteSubCategorySchema
} from "../validations/subCategory.js";

const router = express.Router();

// Public routes
router.get("/", getSubCategory);

// Protected routes
router.post("/", authenticateJWT, validate(createSubCategorySchema), createSubCategory);
router.delete("/:SubUkeyId", authenticateJWT, validate(deleteSubCategorySchema, 'params'), deleteSubCategory);

export default router;