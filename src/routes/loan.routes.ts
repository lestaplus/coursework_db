import { Router } from "express";
import { loanController } from "../controllers/loan.controller.js";

const router = Router();

router.patch("/:id/return", loanController.returnBook);

router.delete("/expired", loanController.deleteExpired);

export default router;
