import { prisma } from "../prisma.js";
import {
  subscription_type,
  subscription_status,
  payment_type,
  payment_status,
  Prisma,
} from "@prisma/client";

export class UserService {
  async registerUserWithTrial(data: {
    name: string;
    surname: string;
    email: string;
    password_hash: string;
    birth_date: Date;
  }) {
    return await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          surname: data.surname,
          email: data.email,
          password_hash: data.password_hash,
          birth_date: data.birth_date,
        },
      });

      const newSubscription = await tx.subscription.create({
        data: {
          user_id: newUser.user_id,
          type: subscription_type.TRIAL,
          status: subscription_status.ACTIVE,
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });

      await tx.payment.create({
        data: {
          subscription_id: newSubscription.subscription_id,
          amount: new Prisma.Decimal(0),
          payment_type: payment_type.CARD,
          status: payment_status.COMPLETED,
        },
      });

      return newUser;
    });
  }

  async softDeleteUser(userId: number) {
    return await prisma.$transaction(async (tx) => {
      const deletedUser = await tx.user.update({
        where: { user_id: userId },
        data: { deleted_at: new Date() },
      });

      await tx.subscription.updateMany({
        where: {
          user_id: userId,
          status: subscription_status.ACTIVE,
        },
        data: { status: subscription_status.CANCELLED },
      });

      return deletedUser;
    });
  }

  async getAllActiveUsers() {
    return await prisma.user.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        subscription: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
      },
    });
  }

  async updateSubscriptionStatus(
    subscriptionId: number,
    newStatus: subscription_status,
    currentVersion: number
  ) {
    const result = await prisma.subscription.updateMany({
      where: {
        subscription_id: subscriptionId,
        version: currentVersion,
      },
      data: {
        status: newStatus,
        version: { increment: 1 },
      },
    });

    if (result.count === 0) {
      throw new Error("Data has been modified by another user");
    }

    return { message: "Status updated successfully" };
  }
}

export const userService = new UserService();
