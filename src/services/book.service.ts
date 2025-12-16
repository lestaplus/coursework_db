import { prisma } from "../prisma";

export class BookService {
  async createBookWithRelations(data: {
    name: string;
    isbn: string;
    publication_date?: string;
    pages_count?: number;
    publisher_id?: number;
    author_ids: number[];
    genre_ids: number[];
  }) {
    return await prisma.$transaction(async (tx: any) => {
      const existingBook = await tx.book.findUnique({
        where: { isbn: data.isbn },
      });

      if (existingBook) {
        throw new Error(`Book with ISBN ${data.isbn} already exists`);
      }

      if (data.pages_count !== undefined && data.pages_count <= 0) {
        throw new Error("Pages count is invalid: must be greater than 0");
      }

      if (data.genre_ids && data.genre_ids.length > 0) {
        const genreCount = await tx.genre.count({
          where: { genre_id: { in: data.genre_ids } },
        });

        if (genreCount !== data.genre_ids.length) {
          throw new Error("One or more provided genre IDs are invalid");
        }
      }

      const newBook = await tx.book.create({
        data: {
          name: data.name,
          isbn: data.isbn,
          publication_date: data.publication_date
            ? new Date(data.publication_date)
            : null,
          pages_count: data.pages_count,
          publisher_id: data.publisher_id,
        },
      });

      if (data.author_ids && data.author_ids.length > 0) {
        await tx.bookauthor.createMany({
          data: data.author_ids.map((id) => ({
            book_id: newBook.book_id,
            author_id: id,
          })),
        });
      }

      if (data.genre_ids && data.genre_ids.length > 0) {
        await tx.bookgenre.createMany({
          data: data.genre_ids.map((id) => ({
            book_id: newBook.book_id,
            genre_id: id,
          })),
        });
      }

      return await tx.book.findUnique({
        where: { book_id: newBook.book_id },
        include: {
          bookauthor: { include: { author: true } },
          bookgenre: { include: { genre: true } },
          publisher: true,
        },
      });
    });
  }

  async getBooksByGenre(genreId: number) {
    return await prisma.book.findMany({
      where: {
        bookgenre: {
          some: {
            genre_id: genreId,
          },
        },
      },
      include: {
        bookauthor: {
          include: {
            author: true,
          },
        },
        publisher: true,
        bookgenre: {
          include: {
            genre: true,
          },
        },
      },
    });
  }

  async getTopPopularBooks(limit: number = 10) {
    const result = await prisma.$queryRaw`
      SELECT 
        b.name as book_title,
        CAST(COUNT(l.loan_id) AS INTEGER) as loan_count,
        STRING_AGG(DISTINCT a.surname, ', ') as authors,
        CAST(DENSE_RANK() OVER (ORDER BY COUNT(l.loan_id) DESC) AS INTEGER) as rank
      FROM book b
      JOIN loan l ON b.book_id = l.book_id
      LEFT JOIN bookauthor ba ON b.book_id = ba.book_id
      LEFT JOIN author a ON ba.author_id = a.author_id
      GROUP BY b.book_id, b.name
      ORDER BY rank ASC
      LIMIT ${limit};
    `;
    return result;
  }
}

export const bookService = new BookService();
