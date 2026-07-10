import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getBudget, updateBudget } from "../controllers/BudgetController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getBudget);
router.put("/", updateBudget);

export default router;
