import express from "express";
import { getDesignation } from "../controllers/DesignationController.js";

const router = express.Router();

// Public routes
router.get("/designationList", getDesignation);

export default router;
