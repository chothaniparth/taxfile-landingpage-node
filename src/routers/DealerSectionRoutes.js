import express from "express";
import {
    createDealerSection, getDealerSection, deleteDealerSection
} from "../controllers/DealerSectionController.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createDealerSectionSchema, deleteDealerSectionSchema
} from "../validations/DealerSectionValidation.js";

const router = express.Router();

// Public routes
router.get("/dealerSectionList", getDealerSection);

// Protected routes
router.post("/AddUpdateDealerSection", authenticateJWT, validate(createDealerSectionSchema), createDealerSection);
router.delete("/DeleteDealerSection/:Cguid", authenticateJWT, validate(deleteDealerSectionSchema), deleteDealerSection);

export default router;
