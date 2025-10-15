import express from "express";
import {
    createDoc, getdoc, deleteDoc, updateDoc
} from "../controllers/docMast.js";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { createDocMastSchema } from "../validations/docValidation.js";
import { DocUploadV1 } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// Public routes
router.get("/DocumentList", getdoc);

// Protected routes
router.post("/AddDocument/:Master", validate(createDocMastSchema), DocUploadV1, createDoc);
router.put("/UpdateDocument/:Master", authenticateJWT, validate(createDocMastSchema), DocUploadV1, updateDoc);
router.delete("/deleteDocument/:DocUkeyId", authenticateJWT, deleteDoc);

export default router;