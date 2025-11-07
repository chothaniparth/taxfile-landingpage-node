import express from "express";
import {
    textContentUpdate, getTextContent
} from "../controllers/textContent.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/getTextContent/:type", getTextContent);

// Protected routes
router.put("/updateTextContent", authenticateJWT, textContentUpdate);

export default router;