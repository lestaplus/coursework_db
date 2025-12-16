import request from "supertest";
import { describe, it, expect, beforeEach, afterAll } from "@jest/globals";
import app from "../../src/app";
import { prisma } from "../../src/prisma";
import { resetDb } from "../helpers/resetdb";

describe("Book Integration Tests", () => {
  beforeEach(async () => await resetDb());
  afterAll(async () => await prisma.$disconnect());

  describe("POST /api/books", () => {
    let authorId: number;
    let genreId: number;

    beforeEach(async () => {
      const author = await prisma.author.create({
        data: { name: "Test", surname: "Author" },
      });
      authorId = author.author_id;

      const genre = await prisma.genre.create({
        data: { name: "Test Genre" },
      });
      genreId = genre.genre_id;
    });

    it("should create a new book with authors and genres", async () => {
      const newBookData = {
        name: "Integration Test Book",
        isbn: "TEST-ISBN-123",
        publication_date: "2024-01-01",
        pages_count: 300,
        author_ids: [authorId],
        genre_ids: [genreId],
      };

      const response = await request(app).post("/api/books").send(newBookData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("book_id");
      expect(response.body.data.name).toBe(newBookData.name);
      expect(response.body.data.bookauthor).toHaveLength(1);
      expect(response.body.data.bookauthor[0].author.author_id).toBe(authorId);
    });

    it("should fail when creating a book with existing ISBN", async () => {
      await prisma.book.create({
        data: {
          name: "Original Book",
          isbn: "TEST-ISBN-123",
          pages_count: 100,
        },
      });

      const duplicateBookData = {
        name: "Another Book",
        isbn: "TEST-ISBN-123",
        author_ids: [authorId],
        genre_ids: [genreId],
      };

      const response = await request(app)
        .post("/api/books")
        .send(duplicateBookData);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/exists/i);
    });

    it("should fail when pages_count is negative", async () => {
      const invalidBookData = {
        name: "Bad Book",
        isbn: "TEST-ISBN-999",
        pages_count: -50,
        author_ids: [authorId],
        genre_ids: [genreId],
      };

      const response = await request(app)
        .post("/api/books")
        .send(invalidBookData);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/books/genre/:id", () => {
    let genreId: number;
    let bookId: number;

    beforeEach(async () => {
      const genre = await prisma.genre.create({
        data: { name: "Sci-Fi" },
      });
      genreId = genre.genre_id;

      const book = await prisma.book.create({
        data: {
          name: "Dune",
          isbn: "DUNE-123",
          bookgenre: {
            create: {
              genre_id: genreId,
            },
          },
        },
      });
      bookId = book.book_id;

      await prisma.book.create({
        data: {
          name: "Romance Book",
          isbn: "LOVE-123",
          bookgenre: {
            create: {
              genre: { create: { name: "Romance" } },
            },
          },
        },
      });
    });

    it("should return books only for the specific genre", async () => {
      const response = await request(app).get(`/api/books/genre/${genreId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe("Dune");
      expect(response.body.data[0].bookgenre[0].genre.name).toBe("Sci-Fi");
    });

    it("should return empty array if genre has no books", async () => {
      const emptyGenre = await prisma.genre.create({
        data: { name: "Empty Genre" },
      });

      const response = await request(app).get(
        `/api/books/genre/${emptyGenre.genre_id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });
});
