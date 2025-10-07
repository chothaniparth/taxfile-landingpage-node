import express from "express";
import {
    createImpDate, getImpDates, deleteImpDate
} from "../controllers/ImpDates.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createImpDatesSchema, deleteImpDatesSchema
} from "../validations/impDatesValidation.js";

const router = express.Router();

// Public routes
router.get("/impDatesList", getImpDates);

// Protected routes
router.post("/addUpdateImpDates", authenticateJWT, validate(createImpDatesSchema), createImpDate);
router.delete("/deleteImpDates/:UkeyId", authenticateJWT, validate(deleteImpDatesSchema, "params"), deleteImpDate);

export default router;