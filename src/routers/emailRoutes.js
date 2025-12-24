import express from "express";
import { getEmail, createEmail, deleteEmail } from "../controllers/email.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/emailList", getEmail);

// Protected routes
router.post("/AddUpdateEmail", createEmail);
router.delete("/DeleteEmail/:id", deleteEmail);

export default router;