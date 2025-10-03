import express from "express";
import {
    createCarousel, getCarousel, deleteCarousel
} from "../controllers/Carousel.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createCarouselSchema,
} from "../validations/carouselValidation.js";

const router = express.Router();

// Public routes
router.get("/", getCarousel);

// Protected routes
router.post("/", validate(createCarouselSchema), createCarousel);
router.delete("/:UkeyId", authenticateJWT, deleteCarousel);

export default router;
