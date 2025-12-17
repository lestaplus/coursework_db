import { subscriptionService } from "../../src/services/subscription.service";
import { prisma } from "../../src/prisma";

jest.mock("../../src/prisma", () => ({
  prisma: {
    subscription: {
      updateMany: jest.fn(),
    },
  },
}));

describe("Subscription Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update status successfully", async () => {
    (prisma.subscription.updateMany as jest.Mock).mockResolvedValue({
      count: 1,
    });

    const result = await subscriptionService.updateStatus(
      1,
      "EXPIRED" as any,
      5
    );

    expect(result.message).toBe("Status updated successfully");
    expect(prisma.subscription.updateMany).toHaveBeenCalledWith({
      where: { subscription_id: 1, version: 5 },
      data: expect.any(Object),
    });
  });

  it("should throw error on version conflict", async () => {
    (prisma.subscription.updateMany as jest.Mock).mockResolvedValue({
      count: 0,
    });

    try {
      await subscriptionService.updateStatus(1, "CANCELLED" as any, 5);
      throw new Error("Test failed: Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("CONFLICT");
    }
  });
});
