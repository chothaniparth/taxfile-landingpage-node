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
import VacancyApplyRoutes from "./VacencyApplyRoutes.js";
import OTPController from '../controllers/OTP.js';
import textContentRouters from './TextContents.js'; 
import EmpSettingRouters from "./EmpSetting.js";
import NewsLetterRouters from './newsLSubscriber.js';
import ContentMastRouter from './ContentMastRouter.js';
import ComplaintMast from "./ComplaintRoutes.js";
import PartyRoutes from "./PartyRoutes.js";
import location from './locationRoutes.js'

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
router.use('/vacencyApply', VacancyApplyRoutes);
router.use('/textContents', textContentRouters);
router.use('/empSetting', EmpSettingRouters);
router.use('/newsLetter', NewsLetterRouters);
router.use('/content', ContentMastRouter);
router.use('/complaint', ComplaintMast);
router.use('/party', PartyRoutes);
router.use('/location', location);
router.get('/sendOTP/:MobileNumber', OTPController);

export default router;