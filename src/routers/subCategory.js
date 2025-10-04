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
router.get("/subCategoryList", getSubCategory);

// Protected routes
router.post("/AddUpdateSubCategory", authenticateJWT, validate(createSubCategorySchema), createSubCategory);
router.delete("/deleteSubCategory/:SubUkeyId", authenticateJWT, validate(deleteSubCategorySchema, 'params'), deleteSubCategory);

export default router;