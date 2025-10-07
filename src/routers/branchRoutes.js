import express from "express";
import {
    createBranchMast, getBranchMast, deleteBranchMast
} from "../controllers/Branch.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createBranchMastSchema, deleteBranchMastSchema
} from "../validations/branchValidation.js";

const router = express.Router();

// Public routes
router.get("/branchList", getBranchMast);

// Protected routes
router.post("/addUpdateBranch", authenticateJWT, validate(createBranchMastSchema), createBranchMast);
router.delete("/deleteBranch/:BranchUkeyId", authenticateJWT, validate(deleteBranchMastSchema), deleteBranchMast);

export default router;