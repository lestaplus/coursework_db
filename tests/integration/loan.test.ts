import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/prisma";
import { loan_status } from "@prisma/client";

describe("Loan Integration Tests", () => {
  let userId: number;
  let bookId: number;
  let activeLoanId: number;

  beforeAll(async () => {
    await prisma.loan.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        name: "Loan",
        surname: "Tester",
        email: "loan@test.com",
        password_hash: "hash",
      },
    });
    userId = user.user_id;

    const book = await prisma.book.create({
      data: {
        name: "Loan Test Book",
        isbn: "LOAN-123",
      },
    });
    bookId = book.book_id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return a book (update status)", async () => {
    const loan = await prisma.loan.create({
      data: {
        user_id: userId,
        book_id: bookId,
        status: loan_status.ACTIVE,
        loan_date: new Date("2024-01-01T10:00:00Z"),
        access_end_date: new Date("2024-02-01"),
      },
    });
    activeLoanId = loan.loan_id;

    const response = await request(app).patch(
      `/api/loans/${activeLoanId}/return`
    );

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe(loan_status.RETURNED);

    const updatedLoan = await prisma.loan.findUnique({
      where: { loan_id: activeLoanId },
    });
    expect(updatedLoan?.status).toBe(loan_status.RETURNED);
  });

  it("should fail if book is already returned", async () => {
    const response = await request(app).patch(
      `/api/loans/${activeLoanId}/return`
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/already returned/i);
  });

  it("should delete expired loans", async () => {
    await prisma.loan.create({
      data: {
        user_id: userId,
        book_id: bookId,
        status: loan_status.EXPIRED,
        loan_date: new Date("2023-01-01"),
        access_end_date: new Date("2023-01-10"),
      },
    });

    const countBefore = await prisma.loan.count({
      where: { status: loan_status.EXPIRED },
    });
    expect(countBefore).toBeGreaterThan(0);

    const response = await request(app).delete("/api/loans/expired");

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted/i);

    const countAfter = await prisma.loan.count({
      where: { status: loan_status.EXPIRED },
    });
    expect(countAfter).toBe(0);
  });
});
