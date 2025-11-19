import express from "express";
import {
    createComplaint, getComplaint, deleteComplaint
} from "../controllers/ComplaintMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createComplaintSchema, deleteComplaintSchema
} from "../validations/ComplainValidation.js";

const router = express.Router();

// Public routes
router.get("/complaintList", getComplaint);

// Protected routes
router.post("/addUpdateComplaints", authenticateJWT, validate(createComplaintSchema), createComplaint);
router.delete("/deleteComplaint/:ComplaintUkeyId", authenticateJWT, validate(deleteComplaintSchema), deleteComplaint);

export default router;