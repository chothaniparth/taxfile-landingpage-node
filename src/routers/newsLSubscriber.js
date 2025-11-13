import express from "express";
import {
    addUpdateNewsLetter, getNewsLetterSubscriber
} from "../controllers/newsSubscriber.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createAboutUsSchema
} from "../validations/newsLetter.js";

const router = express.Router();

// Public routes
router.get("/listNewsLetterSubscriber", getNewsLetterSubscriber);

// Protected routes
router.post("/newsLetterSubscribe", validate(createAboutUsSchema), addUpdateNewsLetter);

export default router;