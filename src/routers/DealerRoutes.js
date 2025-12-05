import express from "express";
import {
    createDealer, getDealer, deleteDealer
} from "../controllers/DealerController.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createDealerSchema, deleteDealerSchema
} from "../validations/DealerValidation.js";

const router = express.Router();

// Public routes
router.get("/dealerList", getDealer);

// Protected routes
router.post("/addUpdateDealer", authenticateJWT, validate(createDealerSchema), createDealer);
router.delete("/deleteDealer/:DealerCguid", authenticateJWT, validate(deleteDealerSchema), deleteDealer);

export default router;