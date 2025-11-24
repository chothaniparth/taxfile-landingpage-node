import express from "express";
import { getCategory } from "../controllers/mst_CategoryController.js";

const router = express.Router();

// Public routes
router.get("/list", getCategory);

export default router;
