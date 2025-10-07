import express from "express";
import {
    getCategory
} from "../controllers/category.js";

const router = express.Router();

// Public routes
router.get("/categoryList", getCategory);

export default router;