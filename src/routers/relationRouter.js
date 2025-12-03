import express from "express";
import { getrelations } from "../controllers/relation.js";

const router = express.Router();

// Public routes
router.get("/getRelations", getrelations);

export default router;