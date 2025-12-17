import { paymentService } from "../../src/services/payment.service";
import { prisma } from "../../src/prisma";

jest.mock("../../src/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    payment: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("Payment Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate pagination correctly", async () => {
    const page = 2;
    const limit = 10;

    const mockData = [{ id: 1 }, { id: 2 }];
    const mockTotal = 25;

    (prisma.$transaction as jest.Mock).mockResolvedValue([mockData, mockTotal]);

    const result = await paymentService.getAllPayments(page, limit);

    const findManyArgs = (prisma.payment.findMany as jest.Mock).mock
      .calls[0][0];

    expect(findManyArgs.skip).toBe(10);
    expect(findManyArgs.take).toBe(10);

    expect(result.meta.total).toBe(25);
    expect(result.meta.last_page).toBe(3);
  });
});
