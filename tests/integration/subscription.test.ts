import request from "supertest";
import { describe, it, expect, beforeEach, afterAll } from "@jest/globals";
import app from "../../src/app";
import { prisma } from "../../src/prisma";
import { resetDb } from "../helpers/resetdb";
import { subscription_status, subscription_type } from "@prisma/client";

describe("Subscription Integration Tests", () => {
  beforeEach(async () => await resetDb());
  afterAll(async () => await prisma.$disconnect());

  describe("PATCH /api/subscriptions/:id", () => {
    let subId: number;
    let initialVersion: number;

    beforeEach(async () => {
      const user = await prisma.user.create({
        data: {
          name: "Test",
          surname: "Lock",
          email: "lock@test.com",
          password_hash: "123",
          subscription: {
            create: {
              type: subscription_type.STANDARD,
              status: subscription_status.ACTIVE,
              start_date: new Date(),
              end_date: new Date(),
              version: 0,
            },
          },
        },
        include: { subscription: true },
      });
      subId = user.subscription[0].subscription_id;
      initialVersion = user.subscription[0].version;
    });

    it("should update status successfully if version matches", async () => {
      const res = await request(app)
        .patch(`/api/subscriptions/${subId}`)
        .send({ status: "EXPIRED", version: initialVersion });

      expect(res.status).toBe(200);
      const updated = await prisma.subscription.findUnique({
        where: { subscription_id: subId },
      });
      expect(updated?.version).toBe(initialVersion + 1);
    });

    it("should fail with 409 if version is outdated", async () => {
      await prisma.subscription.update({
        where: { subscription_id: subId },
        data: { version: { increment: 1 } },
      });

      const res = await request(app)
        .patch(`/api/subscriptions/${subId}`)
        .send({ status: "CANCELLED", version: initialVersion });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/Conflict/);
    });
  });
});
