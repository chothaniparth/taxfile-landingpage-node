import express from "express";
import {
    getBlogCategory, createOrUpdateBlogCategory, deleteBlogCategory
} from "../controllers/blogCategory.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/listBlogCategory", getBlogCategory);

// Protected routes
router.post("/AddUpdateAboutUs", authenticateJWT, createOrUpdateBlogCategory);
router.delete("/DeleteAboutUs/:NewsCatUkeyId", authenticateJWT, deleteBlogCategory);

export default router;