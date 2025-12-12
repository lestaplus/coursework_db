import { prisma } from "../prisma";

export class BookRepository {
  async create(data: {
    name: string;
    isbn: string;
    publisher_id?: number;
    publication_date?: Date;
    pages_count?: number;
  }) {
    return prisma.book.create({ data });
  }

  async findByGenre(genreId: number) {
    return prisma.book.findMany({
      where: {
        bookgenre: {
          some: { genre_id: genreId },
        },
      },
      include: {
        bookauthor: {
          include: { author: true },
        },
      },
    });
  }
}
