import { prisma } from "../prisma";
import { loan_status } from "@prisma/client";

export class LoanService {
  async returnBook(loanId: number) {
    return await prisma.$transaction(async (tx: any) => {
      const loan = await tx.loan.findUnique({
        where: { loan_id: loanId },
        include: { book: true },
      });

      if (!loan) {
        throw new Error("Loan not found");
      }

      if (loan.status === loan_status.RETURNED) {
        throw new Error(
          `Loan for book "${loan.book.name}" is already returned`
        );
      }

      const updatedLoan = await tx.loan.update({
        where: { loan_id: loanId },
        data: {
          status: loan_status.RETURNED,
        },
      });

      return updatedLoan;
    });
  }

  async deleteExpiredLoans() {
    const result = await prisma.loan.deleteMany({
      where: {
        status: loan_status.EXPIRED,
      },
    });

    return { count: result.count };
  }

  async getUserActiveLoans(userId: number) {
    return await prisma.loan.findMany({
      where: {
        user_id: userId,
        status: loan_status.ACTIVE,
      },
      include: {
        book: true,
      },
    });
  }
}

export const loanService = new LoanService();
