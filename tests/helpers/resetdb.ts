import { prisma } from "../../src/prisma";

export async function resetDb() {
  await prisma.bookauthor.deleteMany();
  await prisma.bookgenre.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.publisher.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();
}
