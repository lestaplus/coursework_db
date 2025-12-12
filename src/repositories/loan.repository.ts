import { prisma } from '../prisma';

export class LoanRepository {
    async findActiveByUser(userId: number) {
        return prisma.loan.findMany({
            where: {
                user_id: userId,
                status: 'ACTIVE'
            },
            include: {
                book: true
            }
        });
    }

    async deleteExpired() {
        return prisma.loan.deleteMany({
            where: {
                status: 'EXPIRED'
            }
        });
    }
}