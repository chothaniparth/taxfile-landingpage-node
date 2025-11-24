import express from "express";
import { fetchCity, fetchstate } from "../controllers/location.js";

const router = express.Router();

// Public routes
router.get("/cities", fetchCity);
router.get("/states", fetchstate);

export default router;
