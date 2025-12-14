import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/prisma";

describe("Book Integration Tests", () => {
  let authorId: number;
  let genreId: number;

  beforeAll(async () => {
    await prisma.bookauthor.deleteMany();
    await prisma.bookgenre.deleteMany();
    await prisma.loan.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.genre.deleteMany();

    const author = await prisma.author.create({
      data: { name: "Test", surname: "Author" },
    });
    authorId = author.author_id;

    const genre = await prisma.genre.create({
      data: { name: "Test Genre" },
    });
    genreId = genre.genre_id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
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
    expect(response.body.data.isbn).toBe(newBookData.isbn);

    expect(response.body.data.bookauthor).toHaveLength(1);
    expect(response.body.data.bookauthor[0].author.author_id).toBe(authorId);
    expect(response.body.data.bookgenre).toHaveLength(1);
  });

  it("should fail when creating a book with existing ISBN", async () => {
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
