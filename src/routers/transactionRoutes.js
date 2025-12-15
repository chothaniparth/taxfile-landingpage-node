import express from "express";
import {
    addUpdateTransaction, transactionList, deleteTransaction
} from "../controllers/Transaction.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import {
    createTransaction, deleteTransactionSchema
} from "../validations/transactionValidation.js";

const router = express.Router();

// Public routes
router.get("/transasctionList", transactionList);

// Protected routes
router.post("/addUpdateTransaction", authenticateJWT, validate(createTransaction), addUpdateTransaction);
router.delete("/deleteTransactoin/:TransactionUkeyId", authenticateJWT, validate(deleteTransactionSchema), deleteTransaction);

export default router;