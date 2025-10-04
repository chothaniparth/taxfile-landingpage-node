import express from "express";
import {
    createYTvideo, getYTvideo, deleteYTvideo
} from "../controllers/YTvideoMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createOrUpdateYTvideoSchema,
    deleteYTvideoSchema
} from "../validations/YTvideoValidation.js";

const router = express.Router();

// Public routes
router.get("/", getYTvideo);

// Protected routes
router.post("/", authenticateJWT, validate(createOrUpdateYTvideoSchema), createYTvideo);
router.delete("/:UkeyId", authenticateJWT, validate(deleteYTvideoSchema, 'params'), deleteYTvideo);

export default router;