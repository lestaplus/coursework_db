import { Router } from "express";
import { loanController } from "../controllers/loan.controller";

const router = Router();

router.patch("/:id/return", loanController.returnBook);
router.delete("/expired", loanController.deleteExpired);
router.get("/user/:userId", loanController.getMyLoans);

export default router;
