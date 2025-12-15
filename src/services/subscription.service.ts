import { prisma } from "../prisma.js";
import { subscription_status } from "@prisma/client";

export class SubscriptionService {
  async updateStatus(
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
      throw new Error("CONFLICT: Data has been modified by another user");
    }

    return { message: "Status updated successfully" };
  }
}

export const subscriptionService = new SubscriptionService();