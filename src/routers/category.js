import express from "express";
import {
    getCategory, createOrUpdateCategory, deleteCategory
} from "../controllers/category.js";
import {createCategorySchema} from '../validations/categoryValidation.js'
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/categoryList", getCategory);

router.post('/createOrUpdateCategory', authenticateJWT, validate(createCategorySchema), createOrUpdateCategory);
router.delete("/categoryDelete/:CategoryId", authenticateJWT, deleteCategory);

export default router;