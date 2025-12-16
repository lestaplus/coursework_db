import { prisma } from "../../src/prisma";

export async function resetDb() {
  await prisma.book.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
}
