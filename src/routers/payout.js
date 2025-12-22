import express from "express";
import { payoutrunList, payoutlineList } from "../controllers/payout.js";

const router = express.Router();

router.get("/payoutrunlist", payoutrunList)
router.get("/payoutlinelist", payoutlineList)

export default router;
