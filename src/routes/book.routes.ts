import { Router } from "express";
import { bookController } from "../controllers/book.controller";

const router = Router();

router.post("/", bookController.createBook);

export default router;
