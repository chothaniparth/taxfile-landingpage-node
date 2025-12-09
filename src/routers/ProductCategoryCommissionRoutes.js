import express from "express";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { getProductCategoryCommission, createProductCategoryCommission, deleteProductCategoryCommission } from "../controllers/ProductCategoryCommission.js";
import { createProductCategoryCommissionSchema, deleteProductCategoryCommissionSchema } from "../validations/ProductCategoryCommission.js";

const router = express.Router();

router.get("/listproductcatcom", getProductCategoryCommission)

router.post("/addupdateproductcatcom", authenticateJWT, validate(createProductCategoryCommissionSchema), createProductCategoryCommission)

router.delete("/deleteproductcatcom/:ProductCategoryCommissionID", authenticateJWT, validate(deleteProductCategoryCommissionSchema), deleteProductCategoryCommission)

export default router