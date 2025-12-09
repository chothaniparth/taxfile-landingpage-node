import express from "express";
import {
    createDealerCustomCommission, getDealerCustomCommission, deleteDealerCustomCommission
} from "../controllers/DealerCustomCommissionController.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createDealerCustomCommissionSchema, deleteDealerCustomCommissionSchema
} from "../validations/DealerCustomCommissionValidation.js";

const router = express.Router();

// Public routes
router.get("/listDealerCustomCommission", getDealerCustomCommission);

// Protected routes
router.post("/AddUpdateDealerCustomCommission", authenticateJWT, validate(createDealerCustomCommissionSchema), createDealerCustomCommission);
router.delete("/DeleteDealerCustomCommission/:DealerCustomCommissionID", authenticateJWT, validate(deleteDealerCustomCommissionSchema,'params'), deleteDealerCustomCommission);

export default router;