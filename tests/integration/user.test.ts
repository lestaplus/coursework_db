import request from "supertest";
import { describe, it, expect, beforeEach, afterAll } from "@jest/globals";
import app from "../../src/app";
import { prisma } from "../../src/prisma";
import { resetDb } from "../helpers/resetdb";
import { subscription_type } from "@prisma/client";

describe("User Integration Tests", () => {
  beforeEach(async () => await resetDb());
  afterAll(async () => await prisma.$disconnect());

  describe("POST /api/users/register", () => {
    it("should create User, Subscription, and Payment in one transaction", async () => {
      const payload = {
        name: "John",
        surname: "Doe",
        email: "john.doe@test.com",
        password: "pass",
        birth_date: "1993-01-01",
      };

      const res = await request(app).post("/api/users/register").send(payload);

      expect(res.status).toBe(201);

      const userInDb = await prisma.user.findUnique({
        where: { email: payload.email },
        include: { subscription: { include: { payment: true } } },
      });

      expect(userInDb).not.toBeNull();
      expect(userInDb?.subscription[0].type).toBe(subscription_type.TRIAL);
      expect(userInDb?.subscription[0].payment[0].status).toBe("COMPLETED");
    });

    it("should rollback transaction if email exists", async () => {
      await prisma.user.create({
        data: {
          name: "Ex",
          surname: "Us",
          email: "dup@test.com",
          password_hash: "123",
        },
      });

      const res = await request(app).post("/api/users/register").send({
        name: "New",
        surname: "Us",
        email: "dup@test.com",
        password: "123",
        birth_date: "2000-01-01",
      });

      expect(res.status).toBe(400);
      const subs = await prisma.subscription.findMany();
      expect(subs.length).toBe(0);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should do soft delete", async () => {
      const user = await prisma.user.create({
        data: {
          name: "Del",
          surname: "Me",
          email: "del@test.com",
          password_hash: "123",
        },
      });

      const res = await request(app).delete(`/api/users/${user.user_id}`);
      expect(res.status).toBe(200);

      const deletedUser = await prisma.user.findUnique({
        where: { user_id: user.user_id },
      });
      expect(deletedUser?.deleted_at).not.toBeNull();
    });
  });
});
