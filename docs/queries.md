# Документація складних SQL-запитів

У цьому документі описані аналітичні SQL-запити, що використовуються в системі **онлайн-бібліотеки** для отримання статистики та управлінських звітів.

Запити виконуються через `prisma.$queryRaw`, що дозволяє використовувати повний функціонал PostgreSQL:

* агрегації (`COUNT`, `SUM`),
* віконні функції (`DENSE_RANK`),
* групування (`GROUP BY`),
* роботу з датами,
* складні обʼєднання (`JOIN`).

---

## Запит 1: Найпопулярніші книги

### Бізнес-питання

**"Які книги є найпопулярнішими серед користувачів за кількістю доступів (Loan)?"**

Звіт дозволяє:

* визначити найчитаніші книги;
* приймати рішення щодо продовження ліцензій або закупівлі додаткових примірників;
* аналізувати інтереси користувачів.

### SQL-запит

```sql
SELECT
  b.name AS book_title,
  CAST(COUNT(l.loan_id) AS INTEGER) AS loan_count,
  STRING_AGG(DISTINCT a.surname, ', ') AS authors,
  CAST(DENSE_RANK() OVER (ORDER BY COUNT(l.loan_id) DESC) AS INTEGER) AS rank
FROM book b
JOIN loan l ON b.book_id = l.book_id
LEFT JOIN bookauthor ba ON b.book_id = ba.book_id
LEFT JOIN author a ON ba.author_id = a.author_id
GROUP BY b.book_id, b.name
ORDER BY rank ASC
LIMIT :limit;
```

### Пояснення логіки

1. **JOIN між `book` та `loan`**
   Дозволяє отримати фактичні дані про те, скільки разів кожна книга видавалась користувачам.

2. **LEFT JOIN з `bookauthor` та `author`**
   Використовується для отримання списку авторів книги. `LEFT JOIN` гарантує, що книга без автора (у теорії) не буде виключена з результатів.

3. **Агрегація:**

   * `COUNT(l.loan_id)` — підрахунок кількості доступів до книги;
   * `STRING_AGG(DISTINCT a.surname, ', ')` — обʼєднання прізвищ авторів в один рядок.

4. **Віконна функція `DENSE_RANK()`**
   Формує рейтинг книг за популярністю без пропусків у нумерації рангів.

5. **LIMIT**
   Обмежує кількість результатів (наприклад, топ-10 книг).

### Приклад виводу

| book_title | loan_count | authors | rank |
| ---------- | ---------- | ------- | ---- |
| 1984       | 42         | Orwell  | 1    |
| Dune       | 35         | Herbert | 2    |
| Solaris    | 28         | Lem     | 3    |

---

## Запит 2: Аналітика доходів за підписками

### Бізнес-питання

**"Який дохід приносить кожен тип підписки по місяцях та скільки унікальних користувачів його формують?"**

Цей звіт використовується для:

* фінансової аналітики;
* оцінки ефективності типів підписок (TRIAL / STANDARD / PREMIUM);
* аналізу динаміки доходів у часі.

### SQL-запит

```sql
SELECT
  TO_CHAR(p.payment_date, 'YYYY-MM') AS month,
  s.type AS subscription_type,
  CAST(SUM(p.amount) AS FLOAT) AS total_revenue,
  CAST(COUNT(DISTINCT s.user_id) AS INTEGER) AS user_count
FROM payment p
JOIN subscription s ON p.subscription_id = s.subscription_id
WHERE p.status = 'COMPLETED'
GROUP BY TO_CHAR(p.payment_date, 'YYYY-MM'), s.type
ORDER BY month DESC, total_revenue DESC;
```

### Пояснення логіки

1. **Фільтрація платежів:**

   * `WHERE p.status = 'COMPLETED'` гарантує, що в розрахунок беруться лише успішні платежі.

2. **Групування за місяцем:**

   * `TO_CHAR(p.payment_date, 'YYYY-MM')` дозволяє агрегувати дані у форматі "рік-місяць".

3. **Агрегатні функції:**

   * `SUM(p.amount)` — загальний дохід за період;
   * `COUNT(DISTINCT s.user_id)` — кількість унікальних користувачів, які здійснили оплату.

4. **JOIN між `payment` та `subscription`:**

   * Дає змогу привʼязати кожен платіж до типу підписки.

5. **ORDER BY:**

   * Спочатку сортування за місяцем (від нових до старих);
   * Потім — за сумою доходу.

### Приклад виводу

| month   | subscription_type | total_revenue | user_count |
| ------- | ----------------- | ------------- | ---------- |
| 2025-05 | PREMIUM           | 1520.00       | 42         |
| 2025-05 | STANDARD          | 980.00        | 58         |
| 2025-04 | PREMIUM           | 1340.00       | 39         |
