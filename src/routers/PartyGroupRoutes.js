import express from "express";
import {
    createPartyGroup, getPartyGroup, deletePartyGroup
} from "../controllers/PartyGroupController.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createPartyGroupSchema, deletePartyGroupSchema
} from "../validations/PartyGroupValidation.js";

const router = express.Router();

// Public routes
router.get("/listPartyGroup", getPartyGroup);

// Protected routes
router.post("/AddUpdatePartyGroup", authenticateJWT, validate(createPartyGroupSchema), createPartyGroup);
router.delete("/DeletePartyGroup/:GroupUkeyId", authenticateJWT, validate(deletePartyGroupSchema), deletePartyGroup);

export default router;
