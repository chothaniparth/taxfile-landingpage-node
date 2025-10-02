import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/userValidation.js";

const router = express.Router();

// Public routes
router.post("/", validate(createUserSchema), createUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", getUsers);
router.put("/", validate(updateUserSchema), updateUser);
router.delete("/:UserId", authenticateJWT, deleteUser);

export default router;
