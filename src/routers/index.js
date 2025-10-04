import express from "express";
import userRoutes from "./userRoutes.js";
import carouselRoutes from "./carouselRoutes.js";
import docMastRoutes from "./docMast.js";
import SubCategory from './subCategory.js';
import faqRoutes from './faqRoutes.js';
import YTvideoRoutes from './YTvideoRoutes.js';

const router = express.Router();

router.use("/users", userRoutes);
router.use("/carousel", carouselRoutes);
router.use("/documents", docMastRoutes);
router.use("/subcategory", SubCategory);
router.use("/faqs", faqRoutes);
router.use("/ytvideos", YTvideoRoutes);

export default router;