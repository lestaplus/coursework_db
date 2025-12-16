import request from "supertest";
import { describe, it, expect, beforeEach, afterAll } from "@jest/globals";
import app from "../../src/app";
import { prisma } from "../../src/prisma";
import { resetDb } from "../helpers/resetdb";
import { subscription_status, subscription_type } from "@prisma/client";

describe("Payment Integration Tests", () => {
  beforeEach(async () => await resetDb());
  afterAll(async () => await prisma.$disconnect());

  describe("GET /api/payments/analytics/revenue", () => {
    it("should calculate revenue correctly", async () => {
      const user = await prisma.user.create({
        data: {
          name: "Ana",
          surname: "Lytics",
          email: "money@test.com",
          password_hash: "123",
        },
      });
      const sub = await prisma.subscription.create({
        data: {
          user_id: user.user_id,
          type: subscription_type.PREMIUM,
          status: subscription_status.ACTIVE,
          start_date: new Date(),
          end_date: new Date(),
        },
      });
      await prisma.payment.createMany({
        data: [
          {
            subscription_id: sub.subscription_id,
            amount: 100,
            status: "COMPLETED",
            payment_type: "CARD",
          },
          {
            subscription_id: sub.subscription_id,
            amount: 50,
            status: "COMPLETED",
            payment_type: "PAYPAL",
          },
        ],
      });

      const res = await request(app).get("/api/payments/analytics/revenue");

      expect(res.status).toBe(200);
      const premiumStats = res.body.data.find(
        (r: any) => r.subscription_type === "PREMIUM"
      );
      expect(premiumStats.total_revenue).toBe(150);
    });
  });

  describe("GET /api/payments", () => {
    it("should return paginated results", async () => {
      const user = await prisma.user.create({
        data: {
          name: "Pag",
          surname: "Ination",
          email: "pages@test.com",
          password_hash: "123",
        },
      });
      const sub = await prisma.subscription.create({
        data: {
          user_id: user.user_id,
          type: subscription_type.STANDARD,
          status: subscription_status.ACTIVE,
          start_date: new Date(),
          end_date: new Date(),
        },
      });

      await prisma.payment.createMany({
        data: Array(12).fill({
          subscription_id: sub.subscription_id,
          amount: 10,
          status: "COMPLETED",
          payment_type: "CARD",
        }),
      });

      const res = await request(app).get("/api/payments?page=1&limit=10");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(10);
      expect(res.body.meta.total).toBe(12);
      expect(res.body.meta.last_page).toBe(2);
    });
  });
});
