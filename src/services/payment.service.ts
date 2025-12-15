import { prisma } from "../prisma";

export class PaymentService {
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