import express from "express";
import userRoutes from "./userRoutes.js";
import carouselRoutes from "./carouselRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/carousel", carouselRoutes);

export default router;