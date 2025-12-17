import { userService } from "../../src/services/user.service";
import { prisma } from "../../src/prisma";

jest.mock("../../src/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    user: {
      create: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
  },
}));

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register user via transaction", async () => {
    const userData = {
      name: "Petro",
      surname: "Student",
      email: "petro@test.com",
      password_hash: "secret",
      birth_date: new Date(),
    };

    (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
      return callback(prisma);
    });

    (prisma.user.create as jest.Mock).mockResolvedValue({
      user_id: 1,
      ...userData,
    });
    (prisma.subscription.create as jest.Mock).mockResolvedValue({
      subscription_id: 10,
      type: "TRIAL",
    });
    (prisma.payment.create as jest.Mock).mockResolvedValue({ payment_id: 100 });

    const result = await userService.registerUserWithTrial(userData);

    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.subscription.create).toHaveBeenCalledTimes(1);
    expect(prisma.payment.create).toHaveBeenCalledTimes(1);

    expect(result.user_id).toBe(1);
  });
});
