import express from "express";
import {
    getUpdateHistory
} from "../controllers/autoUpdateHistory.js";

const router = express.Router();

// Public routes
router.get("/listAutoUpdateHistory", getUpdateHistory);

export default router;