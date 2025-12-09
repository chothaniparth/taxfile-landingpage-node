import express from "express";
import {
    createProductCommission, getProductCommission, deleteProductCommission
} from "../controllers/ProductCommissionController.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createProductCommissionSchema, deleteProductCommissionSchema
} from "../validations/ProductCommissionValidation.js";

const router = express.Router();

// Public routes
router.get("/listProductCommission", getProductCommission);

// Protected routes
router.post("/AddUpdateProductCommission", authenticateJWT, validate(createProductCommissionSchema), createProductCommission);
router.delete("/DeleteProductCommission/:ProductCommissionID", authenticateJWT, validate(deleteProductCommissionSchema,'params'), deleteProductCommission);

export default router;
