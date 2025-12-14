import { Request, Response } from "express";
import { bookService } from "../services/book.service";

class BookController {
  async createBook(req: Request, res: Response) {
    try {
      const {
        name,
        isbn,
        publication_date,
        pages_count,
        publisher_id,
        author_ids,
        genre_ids,
      } = req.body;

      const book = await bookService.createBookWithRelations({
        name,
        isbn,
        publication_date,
        pages_count: pages_count ? Number(pages_count) : undefined,
        publisher_id: publisher_id ? Number(publisher_id) : undefined,
        author_ids: author_ids || [],
        genre_ids: genre_ids || [],
      });

      res.status(201).json({ status: "success", data: book });
    } catch (error: any) {
      if (
        error.message.includes("exists") ||
        error.message.includes("invalid")
      ) {
        res.status(400).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({ status: "error", message: error.message });
      }
    }
  }
}

export const bookController = new BookController();
