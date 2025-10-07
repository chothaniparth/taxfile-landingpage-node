import express from "express";
import {
    createVacancy, getVacancy, deleteVacancy
} from "../controllers/vacancymast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createVacancySchema, deleteVacancySchema
} from "../validations/vacancyValidation.js";

const router = express.Router();

// Public routes
router.get("/vacencyList", getVacancy);

// Protected routes
router.post("/addUpdateVacency", authenticateJWT, validate(createVacancySchema), createVacancy);
router.delete("/deleteVacency/:VacancyUkeyId", authenticateJWT, validate(deleteVacancySchema), deleteVacancy);

export default router;