import { prisma } from "../prisma";

export class PaymentService {
  async getAllPayments(page: number = 1, limit: number = 10, userId?: number) {
    const skip = (page - 1) * limit;

    const [payments, total] = await prisma.$transaction([
      prisma.payment.findMany({
        where: userId ? { subscription: { user_id: userId } } : {},
        take: limit,
        skip: skip,
        orderBy: { payment_date: "desc" },
        include: {
          subscription: {
            select: {
              type: true,
              User: { select: { email: true } },
            },
          },
        },
      }),
      prisma.payment.count({ where: userId ? { subscription: { user_id: userId } } : {} }),
    ]);

    return {
      data: payments,
      meta: { total, page, last_page: Math.ceil(total / limit) },
    };
  }

  async getRevenueAnalytics() {
    const result = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(p.payment_date, 'YYYY-MM') as month,
        s.type as subscription_type,
        CAST(SUM(p.amount) AS FLOAT) as total_revenue,
        CAST(COUNT(DISTINCT s.user_id) AS INTEGER) as user_count
      FROM "payment" p
      JOIN "subscription" s ON p.subscription_id = s.subscription_id
      WHERE p.status = 'COMPLETED'
      GROUP BY TO_CHAR(p.payment_date, 'YYYY-MM'), s.type
      ORDER BY month DESC, total_revenue DESC;
    `;
    return result;
  }
}

export const paymentService = new PaymentService();
