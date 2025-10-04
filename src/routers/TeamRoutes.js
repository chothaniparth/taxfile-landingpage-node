import express from "express";
import {
    createTeam, getTeam, deleteTeam
} from "../controllers/TeamMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createTeamSchema, deleteTeamSchema
} from "../validations/TeamValidation.js";

const router = express.Router();

// Public routes
router.get("/", getTeam);

// Protected routes
router.post("/", authenticateJWT, validate(createTeamSchema), createTeam);
router.delete("/:UkeyId", authenticateJWT, validate(deleteTeamSchema), deleteTeam);

export default router;