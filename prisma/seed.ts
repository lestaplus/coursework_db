import {
  PrismaClient,
  Prisma,
  loan_status,
  payment_status,
  payment_type,
  subscription_status,
  subscription_type,
} from "@prisma/client";
import { prisma } from '../src/prisma';

async function main() {
  console.log("Seeding...");

  const deleteTable = async (model: any) => await model.deleteMany();

  await deleteTable(prisma.payment);
  await deleteTable(prisma.loan);
  await deleteTable(prisma.subscription);
  await deleteTable(prisma.bookauthor);
  await deleteTable(prisma.bookgenre);
  await deleteTable(prisma.book);
  await deleteTable(prisma.author);
  await deleteTable(prisma.publisher);
  await deleteTable(prisma.genre);
  await deleteTable(prisma.country);
  await deleteTable(prisma.user);

  console.log("Database cleaned");

  await prisma.country.createMany({
    data: [
      { country_id: 1, name: "Ukraine" },
      { country_id: 2, name: "USA" },
      { country_id: 3, name: "United Kingdom" },
      { country_id: 4, name: "France" },
      { country_id: 5, name: "Germany" },
      { country_id: 6, name: "Poland" },
      { country_id: 7, name: "Japan" },
      { country_id: 8, name: "Canada" },
      { country_id: 9, name: "Sweden" },
      { country_id: 10, name: "Italy" },
    ],
  });
  console.log("Countries created");

  await prisma.genre.createMany({
    data: [
      { genre_id: 1, name: "Science Fiction", description: "Futuristic tech" },
      { genre_id: 2, name: "Fantasy", description: "Magic worlds" },
      { genre_id: 3, name: "Mystery", description: "Detective stories" },
      { genre_id: 4, name: "Classic", description: "Gold standard" },
      { genre_id: 5, name: "Computer Science", description: "Tech books" },
      { genre_id: 6, name: "History", description: "Past events" },
      { genre_id: 7, name: "Psychology", description: "Mind games" },
      { genre_id: 8, name: "Biography", description: "Real lives" },
      { genre_id: 9, name: "Horror", description: "Scary stuff" },
      { genre_id: 10, name: "Romance", description: "Love stories" },
    ],
  });
  console.log("Genres created");

  await prisma.publisher.createMany({
    data: [
      {
        publisher_id: 1,
        name: "Ababahalamaha",
        founded_date: new Date("1992-01-01"),
        country_id: 1,
      },
      {
        publisher_id: 2,
        name: "O'Reilly",
        founded_date: new Date("1980-01-01"),
        country_id: 2,
      },
      {
        publisher_id: 3,
        name: "Penguin",
        founded_date: new Date("1930-01-01"),
        country_id: 3,
      },
      {
        publisher_id: 4,
        name: "Stary Lev",
        founded_date: new Date("2001-01-01"),
        country_id: 1,
      },
      {
        publisher_id: 5,
        name: "HarperCollins",
        founded_date: new Date("1989-01-01"),
        country_id: 2,
      },
      {
        publisher_id: 6,
        name: "Springer",
        founded_date: new Date("1842-01-01"),
        country_id: 5,
      },
      {
        publisher_id: 7,
        name: "Folio",
        founded_date: new Date("1990-01-01"),
        country_id: 1,
      },
      {
        publisher_id: 8,
        name: "Hachette",
        founded_date: new Date("1826-01-01"),
        country_id: 4,
      },
      {
        publisher_id: 9,
        name: "Kodansha",
        founded_date: new Date("1909-01-01"),
        country_id: 7,
      },
      {
        publisher_id: 10,
        name: "Znak",
        founded_date: new Date("1959-01-01"),
        country_id: 6,
      },
    ],
  });
  console.log("Publishers created");

  await prisma.author.createMany({
    data: [
      {
        author_id: 1,
        name: "Taras",
        surname: "Shevchenko",
        birth_date: new Date("1814-03-09"),
        country_id: 1,
      },
      {
        author_id: 2,
        name: "J.K.",
        surname: "Rowling",
        birth_date: new Date("1965-07-31"),
        country_id: 3,
      },
      {
        author_id: 3,
        name: "Stephen",
        surname: "King",
        birth_date: new Date("1947-09-21"),
        country_id: 2,
      },
      {
        author_id: 4,
        name: "George",
        surname: "Orwell",
        birth_date: new Date("1903-06-25"),
        country_id: 3,
      },
      {
        author_id: 5,
        name: "Lina",
        surname: "Kostenko",
        birth_date: new Date("1930-03-19"),
        country_id: 1,
      },
      {
        author_id: 6,
        name: "Isaac",
        surname: "Asimov",
        birth_date: new Date("1920-01-02"),
        country_id: 2,
      },
      {
        author_id: 7,
        name: "Robert",
        surname: "Martin",
        birth_date: new Date("1952-12-05"),
        country_id: 2,
      },
      {
        author_id: 8,
        name: "Agatha",
        surname: "Christie",
        birth_date: new Date("1890-09-15"),
        country_id: 3,
      },
      {
        author_id: 9,
        name: "Serhiy",
        surname: "Zhadan",
        birth_date: new Date("1974-08-23"),
        country_id: 1,
      },
      {
        author_id: 10,
        name: "Haruki",
        surname: "Murakami",
        birth_date: new Date("1949-01-12"),
        country_id: 7,
      },
    ],
  });
  console.log("Authors created");

  await prisma.book.createMany({
    data: [
      {
        book_id: 1,
        name: "Kobzar",
        isbn: "978-1",
        pages_count: 250,
        publication_date: new Date("1840-01-01"),
        publisher_id: 1,
      },
      {
        book_id: 2,
        name: "Harry Potter 1",
        isbn: "978-2",
        pages_count: 223,
        publication_date: new Date("1997-06-26"),
        publisher_id: 3,
      },
      {
        book_id: 3,
        name: "The Shining",
        isbn: "978-3",
        pages_count: 447,
        publication_date: new Date("1977-01-28"),
        publisher_id: 5,
      },
      {
        book_id: 4,
        name: "1984",
        isbn: "978-4",
        pages_count: 328,
        publication_date: new Date("1949-06-08"),
        publisher_id: 3,
      },
      {
        book_id: 5,
        name: "Clean Code",
        isbn: "978-5",
        pages_count: 464,
        publication_date: new Date("2008-08-01"),
        publisher_id: 2,
      },
      {
        book_id: 6,
        name: "Foundation",
        isbn: "978-6",
        pages_count: 255,
        publication_date: new Date("1951-01-01"),
        publisher_id: 5,
      },
      {
        book_id: 7,
        name: "Marusia Churai",
        isbn: "978-7",
        pages_count: 180,
        publication_date: new Date("1979-01-01"),
        publisher_id: 4,
      },
      {
        book_id: 8,
        name: "Voroshilovgrad",
        isbn: "978-8",
        pages_count: 310,
        publication_date: new Date("2010-01-01"),
        publisher_id: 7,
      },
      {
        book_id: 9,
        name: "Norwegian Wood",
        isbn: "978-9",
        pages_count: 296,
        publication_date: new Date("1987-01-01"),
        publisher_id: 9,
      },
      {
        book_id: 10,
        name: "Orient Express",
        isbn: "978-10",
        pages_count: 256,
        publication_date: new Date("1934-01-01"),
        publisher_id: 3,
      },
    ],
  });
  console.log("Books created");

  await prisma.bookauthor.createMany({
    data: [
      { book_id: 1, author_id: 1 },
      { book_id: 2, author_id: 2 },
      { book_id: 3, author_id: 3 },
      { book_id: 4, author_id: 4 },
      { book_id: 5, author_id: 7 },
      { book_id: 6, author_id: 6 },
      { book_id: 7, author_id: 5 },
      { book_id: 8, author_id: 9 },
      { book_id: 9, author_id: 10 },
      { book_id: 10, author_id: 8 },
    ],
  });

  await prisma.bookgenre.createMany({
    data: [
      { book_id: 1, genre_id: 4 },
      { book_id: 2, genre_id: 2 },
      { book_id: 3, genre_id: 9 },
      { book_id: 4, genre_id: 1 },
      { book_id: 5, genre_id: 5 },
      { book_id: 6, genre_id: 1 },
      { book_id: 7, genre_id: 6 },
      { book_id: 8, genre_id: 3 },
      { book_id: 9, genre_id: 10 },
      { book_id: 10, genre_id: 3 },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        user_id: 1,
        name: "Ivan",
        surname: "Petrenko",
        email: "ivan@ex.com",
        password_hash: "pass1",
        birth_date: new Date("1990-01-01"),
      },
      {
        user_id: 2,
        name: "Maria",
        surname: "Koval",
        email: "maria@ex.com",
        password_hash: "pass2",
        birth_date: new Date("1995-02-02"),
      },
      {
        user_id: 3,
        name: "Oleg",
        surname: "Bondar",
        email: "oleg@ex.com",
        password_hash: "pass3",
        birth_date: new Date("1988-03-03"),
      },
      {
        user_id: 4,
        name: "Anna",
        surname: "Shevchuk",
        email: "anna@ex.com",
        password_hash: "pass4",
        birth_date: new Date("2000-04-04"),
      },
      {
        user_id: 5,
        name: "Dmytro",
        surname: "Boyko",
        email: "dim@ex.com",
        password_hash: "pass5",
        birth_date: new Date("1992-05-05"),
      },
      {
        user_id: 6,
        name: "Yulia",
        surname: "Tkach",
        email: "yulia@ex.com",
        password_hash: "pass6",
        birth_date: new Date("1998-06-06"),
      },
      {
        user_id: 7,
        name: "Andriy",
        surname: "Melnyk",
        email: "andriy@ex.com",
        password_hash: "pass7",
        birth_date: new Date("1985-07-07"),
      },
      {
        user_id: 8,
        name: "Olena",
        surname: "Kravets",
        email: "olena@ex.com",
        password_hash: "pass8",
        birth_date: new Date("1993-08-08"),
      },
      {
        user_id: 9,
        name: "Pavlo",
        surname: "Rudenko",
        email: "pavlo@ex.com",
        password_hash: "pass9",
        birth_date: new Date("1991-09-09"),
      },
      {
        user_id: 10,
        name: "Katya",
        surname: "Lysenko",
        email: "katya@ex.com",
        password_hash: "pass10",
        birth_date: new Date("1999-10-10"),
      },
    ],
  });
  console.log("Users created");

  await prisma.subscription.createMany({
    data: [
      {
        subscription_id: 1,
        user_id: 1,
        type: subscription_type.STANDARD,
        status: subscription_status.ACTIVE,
        start_date: new Date("2024-01-01"),
        end_date: new Date("2025-01-01"),
      },
      {
        subscription_id: 2,
        user_id: 2,
        type: subscription_type.PREMIUM,
        status: subscription_status.ACTIVE,
        start_date: new Date("2024-01-01"),
        end_date: new Date("2025-01-01"),
      },
      {
        subscription_id: 3,
        user_id: 3,
        type: subscription_type.TRIAL,
        status: subscription_status.EXPIRED,
        start_date: new Date("2023-01-01"),
        end_date: new Date("2023-02-01"),
      },
      {
        subscription_id: 4,
        user_id: 4,
        type: subscription_type.STANDARD,
        status: subscription_status.ACTIVE,
        start_date: new Date("2024-03-01"),
        end_date: new Date("2025-03-01"),
      },
      {
        subscription_id: 5,
        user_id: 5,
        type: subscription_type.PREMIUM,
        status: subscription_status.CANCELLED,
        start_date: new Date("2023-06-01"),
        end_date: new Date("2024-06-01"),
      },
      {
        subscription_id: 6,
        user_id: 6,
        type: subscription_type.STANDARD,
        status: subscription_status.ACTIVE,
        start_date: new Date("2024-05-01"),
        end_date: new Date("2025-05-01"),
      },
      {
        subscription_id: 7,
        user_id: 7,
        type: subscription_type.PREMIUM,
        status: subscription_status.EXPIRED,
        start_date: new Date("2022-01-01"),
        end_date: new Date("2023-01-01"),
      },
      {
        subscription_id: 8,
        user_id: 8,
        type: subscription_type.TRIAL,
        status: subscription_status.ACTIVE,
        start_date: new Date("2024-11-01"),
        end_date: new Date("2024-12-01"),
      },
      {
        subscription_id: 9,
        user_id: 9,
        type: subscription_type.STANDARD,
        status: subscription_status.ACTIVE,
        start_date: new Date("2024-01-01"),
        end_date: new Date("2025-01-01"),
      },
      {
        subscription_id: 10,
        user_id: 10,
        type: subscription_type.PREMIUM,
        status: subscription_status.ACTIVE,
        start_date: new Date("2024-04-01"),
        end_date: new Date("2025-04-01"),
      },
    ],
  });
  console.log("Subscriptions created");

  await prisma.payment.createMany({
    data: [
      {
        payment_id: 1,
        subscription_id: 1,
        amount: new Prisma.Decimal(100),
        payment_type: payment_type.CARD,
        status: payment_status.COMPLETED,
      },
      {
        payment_id: 2,
        subscription_id: 2,
        amount: new Prisma.Decimal(200),
        payment_type: payment_type.PAYPAL,
        status: payment_status.COMPLETED,
      },
      {
        payment_id: 3,
        subscription_id: 4,
        amount: new Prisma.Decimal(100),
        payment_type: payment_type.CARD,
        status: payment_status.COMPLETED,
      },
      {
        payment_id: 4,
        subscription_id: 5,
        amount: new Prisma.Decimal(200),
        payment_type: payment_type.CRYPTO,
        status: payment_status.FAILED,
      },
      {
        payment_id: 5,
        subscription_id: 6,
        amount: new Prisma.Decimal(100),
        payment_type: payment_type.CARD,
        status: payment_status.PENDING,
      },
      {
        payment_id: 6,
        subscription_id: 8,
        amount: new Prisma.Decimal(0),
        payment_type: payment_type.CARD,
        status: payment_status.COMPLETED,
      },
      {
        payment_id: 7,
        subscription_id: 9,
        amount: new Prisma.Decimal(100),
        payment_type: payment_type.PAYPAL,
        status: payment_status.COMPLETED,
      },
      {
        payment_id: 8,
        subscription_id: 10,
        amount: new Prisma.Decimal(200),
        payment_type: payment_type.CARD,
        status: payment_status.COMPLETED,
      },
    ],
  });
  console.log("Payments created");

  await prisma.loan.createMany({
    data: [
      {
        user_id: 1,
        book_id: 1,
        subscription_id: 1,
        status: loan_status.RETURNED,
        access_end_date: new Date("2024-10-15"),
      },
      {
        user_id: 1,
        book_id: 2,
        subscription_id: 1,
        status: loan_status.ACTIVE,
        access_end_date: new Date("2024-12-04"),
      },
      {
        user_id: 2,
        book_id: 3,
        subscription_id: 2,
        status: loan_status.ACTIVE,
        access_end_date: new Date("2024-11-15"),
      },
      {
        user_id: 2,
        book_id: 5,
        subscription_id: 2,
        status: loan_status.ACTIVE,
        access_end_date: new Date("2024-11-19"),
      },
      {
        user_id: 3,
        book_id: 4,
        subscription_id: 3,
        status: loan_status.RETURNED,
        access_end_date: new Date("2023-01-24"),
      },
      {
        user_id: 4,
        book_id: 6,
        subscription_id: 4,
        status: loan_status.EXPIRED,
        access_end_date: new Date("2024-04-03"),
      },
      {
        user_id: 6,
        book_id: 7,
        subscription_id: 6,
        status: loan_status.RETURNED,
        access_end_date: new Date("2024-05-24"),
      },
      {
        user_id: 9,
        book_id: 10,
        subscription_id: 9,
        status: loan_status.RETURNED,
        access_end_date: new Date("2024-02-28"),
      },
      {
        user_id: 10,
        book_id: 9,
        subscription_id: 10,
        status: loan_status.ACTIVE,
        access_end_date: new Date("2024-06-15"),
      },
      {
        user_id: 8,
        book_id: 8,
        subscription_id: 8,
        status: loan_status.ACTIVE,
        access_end_date: new Date("2024-11-19"),
      },
    ],
  });
  console.log("Loans created");

  const tables = [
    { model: "User", pk: "user_id" },
    { model: "country", pk: "country_id" },
    { model: "genre", pk: "genre_id" },
    { model: "publisher", pk: "publisher_id" },
    { model: "author", pk: "author_id" },
    { model: "book", pk: "book_id" },
    { model: "subscription", pk: "subscription_id" },
    { model: "payment", pk: "payment_id" },
    { model: "loan", pk: "loan_id"}
  ];

  for (const t of tables) {
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"${t.model}"', '${t.pk}'),
        COALESCE((SELECT MAX("${t.pk}") FROM "${t.model}"), 0) + 1,
        false
      );
    `);
  }

  console.log("Sequences reset.");
  console.log("Seeding finished successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
