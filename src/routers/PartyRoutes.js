import express from "express";
import {
    createParty, getParty, deleteParty, cityWisePartyCount
} from "../controllers/PartyMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createPartySchema, deletePartySchema
} from "../validations/PartyValidation.js";

const router = express.Router();

// Public routes
router.get("/listParty", getParty);
router.get("/cityWisePartycountList", cityWisePartyCount);

// Protected routes
router.post("/AddUpdateParty", authenticateJWT, validate(createPartySchema), createParty);
router.delete("/DeleteParty/:CustomerID/:Cguid", authenticateJWT, validate(deletePartySchema), deleteParty);

export default router;