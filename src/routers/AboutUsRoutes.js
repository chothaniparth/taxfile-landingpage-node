import express from "express";
import {
    createAboutUs, getAboutUs, deleteAboutUs
} from "../controllers/AboutUsMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createAboutUsSchema, deleteAboutUsSchema
} from "../validations/AboutUsValidation.js";

const router = express.Router();

// Public routes
router.get("/", getAboutUs);

// Protected routes
router.post("/", authenticateJWT, validate(createAboutUsSchema), createAboutUs);
router.delete("/:AboutUkeyId", authenticateJWT, validate(deleteAboutUsSchema), deleteAboutUs);

export default router;