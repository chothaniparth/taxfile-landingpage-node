import express from "express";
import { getWhatsNew } from "../controllers/whatsNew.js";

const router = express.Router();

// Public routes
router.get("/getWhatsNew", getWhatsNew);

export default router;