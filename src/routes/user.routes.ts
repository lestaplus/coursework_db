import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.post("/register", userController.register);
router.get("/analytics/revenue", userController.getAnalytics);

router.get("/search", userController.getByEmail);

router.get("/", userController.getAll);

router.patch("/subscriptions/:id", userController.updateSubscription);
router.delete("/:id", userController.deleteUser);

export default router;
