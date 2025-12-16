import { Router } from "express";
import { bookController } from "../controllers/book.controller";

const router = Router();

router.post("/", bookController.createBook);
router.get("/genre/:id", bookController.getByGenre);

export default router;
