import express from "express";
import {
    createClient, getClients, deleteClient
} from "../controllers/Client.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createClientSchema, deleteClientSchema
} from "../validations/clientValidation.js";

const router = express.Router();

// Public routes
router.get("/clientList", getClients);

// Protected routes
router.post("/addUpdateClient", validate(createClientSchema), createClient);
router.delete("/deleteClient/:ClientUkeyId", authenticateJWT, validate(deleteClientSchema), deleteClient);

export default router;