import express from "express";
import {
    addUpdateTransaction, transactionList, deleteTransaction, managePayout
} from "../controllers/Transaction.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createTransaction, deleteTransactionSchema, managePaymentSchema
} from "../validations/transactionValidation.js";

const router = express.Router();

// Public routes
router.get("/transasctionList", transactionList);

// Protected routes
router.post("/addUpdateTransaction", authenticateJWT, validate(createTransaction), addUpdateTransaction);
router.post("/managePayout", authenticateJWT, validate(managePaymentSchema), managePayout);
router.delete("/deleteTransactoin/:TransactionUkeyId", authenticateJWT, validate(deleteTransactionSchema), deleteTransaction);

export default router;