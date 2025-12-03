import express from "express";
import { validate } from "../middlewares/validate.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { createBirthdaySchema, deleteBirthdaySchema } from "../validations/Birthday.js";
import { getBirthdayList, createBirthday, deleteBirthday, getBirthdayandAnniversarylist} from "../controllers/Birthday.js";

const router = express.Router();

// Public routes
router.get("/birthdayList", getBirthdayList);

router.get("/birthdayandanniversarylist", getBirthdayandAnniversarylist)

router.post("/addandupdatebirthday", authenticateJWT, validate(createBirthdaySchema), createBirthday);

router.delete("/deletebirthday/:id", authenticateJWT, validate(deleteBirthdaySchema), deleteBirthday)

export default router;
