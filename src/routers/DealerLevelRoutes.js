import express from "express";
import {
    createDealerLevel, getDealerLevel, deleteDealerLevel, getDealerLevelforLP
} from "../controllers/DealerLevelController.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createDealerLevelSchema, deleteDealerLevelSchema
} from "../validations/DealerLevelValidation.js";

const router = express.Router();

// Public routes
router.get("/dealerLevelListforLP", getDealerLevelforLP);

// Protected routes
router.get("/dealerLevelList", authenticateJWT, getDealerLevel);
router.post("/dealerLevelAddUpdate", authenticateJWT, validate(createDealerLevelSchema), createDealerLevel);
router.delete("/dealerLevelDelete/:Cguid", authenticateJWT, validate(deleteDealerLevelSchema, 'params'), deleteDealerLevel);

export default router;
