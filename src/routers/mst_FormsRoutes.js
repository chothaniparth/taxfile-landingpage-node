import express from "express";
import { getForms } from "../controllers/mst_FormsController.js";

const router = express.Router();

// Public routes
router.get("/list", getForms);

export default router;
