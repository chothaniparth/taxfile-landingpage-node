import express from "express";
import {
    createEmpSetting, getEmpSetting
} from "../controllers/EmpSetting.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createEmpSettingSchema
} from "../validations/EmpSetting.js";

const router = express.Router();

// Public routes
router.get("/listEmpSetting", getEmpSetting);

// Protected routes
router.post("/addUpdateEmpSetting", authenticateJWT, validate(createEmpSettingSchema), createEmpSetting);

export default router;