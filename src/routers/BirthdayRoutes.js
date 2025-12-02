import express from "express";
import { getBirthdayList } from "../controllers/Birthday.js";

const router = express.Router();

// Public routes
router.get("/birthdayList", getBirthdayList);

export default router;
