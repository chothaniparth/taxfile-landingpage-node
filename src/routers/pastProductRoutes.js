import express from "express";
import {
    getPastProduct
} from "../controllers/pastProduct.js";

const router = express.Router();

// Public routes
router.get("/listPastProduct", getPastProduct);

export default router;