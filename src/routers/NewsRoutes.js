import express from "express";
import {
    createNews, getNews, deleteNews
} from "../controllers/NewsMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createNewsSchema, deleteNewsSchema
} from "../validations/NewsValidation.js";

const router = express.Router();

// Public routes
router.get("/newsList", getNews);

// Protected routes
router.post("/addUpdateNews", authenticateJWT, validate(createNewsSchema), createNews);
router.delete("/deleteNews/:UkeyId", authenticateJWT, validate(deleteNewsSchema), deleteNews);

export default router;