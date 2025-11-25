import express from "express";
import { getArea } from "../controllers/AreaController.js";

const router = express.Router();

// Public routes
router.get("/araaList", getArea);

export default router;
