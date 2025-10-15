import express from "express";
import {
    createVacancyApply, getVacancyApply, deleteVacancyApply
} from "../controllers/VacencyApply.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createVacancyApplySchema, deleteVacancyApplySchema
} from "../validations/VacencyApplyValidation.js";

const router = express.Router();

// Public routes
router.get("/vacencyApplyList", getVacancyApply);

// Protected routes
router.post("/addUpdateVacencyApply", validate(createVacancyApplySchema), createVacancyApply);
router.delete("/deleveVacencyApply/:UkeyId", validate(deleteVacancyApplySchema), deleteVacancyApply);

export default router;