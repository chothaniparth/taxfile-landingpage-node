import express from "express";
import { getEmail, createEmail, deleteEmail } from "../controllers/email.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/emailList", getEmail);

// Protected routes
router.post("/AddUpdateEmail", authenticateJWT, createEmail);
router.delete("/DeleteEmail/:id", authenticateJWT, deleteEmail);

export default router;