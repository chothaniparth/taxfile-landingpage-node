import express from "express";
import {
    createOrUpdateProduct, getProducts, deleteProduct, getProductById
} from "../controllers/Product.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createProductSchema, deleteProductSchema
} from "../validations/productValidation.js";

const router = express.Router();

// Public routes
router.get("/productList", getProducts);
router.get("/productList/:ProductUkeyId", getProductById);

// Protected routes
router.post("/AddUpdateProduct", authenticateJWT, validate(createProductSchema), createOrUpdateProduct);
router.delete("/deleteProduct/:ProductUkeyId", authenticateJWT, validate(deleteProductSchema), deleteProduct);

export default router;