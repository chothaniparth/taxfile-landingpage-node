import express from "express";
import userRoutes from "./userRoutes.js";
import carouselRoutes from "./carouselRoutes.js";
import docMastRoutes from "./docMast.js";
import SubCategory from './subCategory.js';
import faqRoutes from './faqRoutes.js';
import YTvideoRoutes from './YTvideoRoutes.js';
import AboutUsRoutes from './AboutUsRoutes.js';
import NewsRoutes from './NewsRoutes.js';
import TeamRoutes from './TeamRoutes.js'
import clientRoutes from './clientRoutes.js';
import productRoutes from './productRoutes.js';
import vacancyRoutes from './vacancyRoutes.js';
import branchRoutes from './branchRoutes.js';
import InqueryRoutes from './InqueryRoutes.js';
import ImpDatesRoutes from './ImpDatesRoutes.js';
import CategoryRoutes from './category.js';

const router = express.Router();

router.use("/users", userRoutes);
router.use("/carousel", carouselRoutes);
router.use("/documents", docMastRoutes);
router.use("/subcategory", SubCategory);
router.use("/faqs", faqRoutes);
router.use("/ytvideos", YTvideoRoutes);
router.use("/aboutus", AboutUsRoutes);
router.use("/news", NewsRoutes);
router.use("/team", TeamRoutes);
router.use("/clients", clientRoutes);
router.use("/product", productRoutes);
router.use("/vacancy", vacancyRoutes);
router.use("/branch", branchRoutes);
router.use("/inquiries", InqueryRoutes);
router.use("/impdates", ImpDatesRoutes);
router.use("/category", CategoryRoutes);

export default router;