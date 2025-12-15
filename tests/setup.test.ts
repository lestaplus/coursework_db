import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { prisma } from "../src/prisma.js";

describe("Environment Setup", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should connect to the test database", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Test",
        surname: "Env",
        email: "test.env@example.com",
        password_hash: "hashed_passwd",
      },
    });
    expect(user).toBeDefined();
    expect(user.email).toBe("test.env@example.com");

    console.log("Connected DB:", process.env.DATABASE_URL);
  });
});
