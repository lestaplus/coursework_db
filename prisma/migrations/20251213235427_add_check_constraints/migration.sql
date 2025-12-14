ALTER TABLE "book" 
ADD CONSTRAINT "check_book_pages" CHECK (pages_count > 0);

ALTER TABLE "payment" 
ADD CONSTRAINT "check_payment_amount" CHECK (amount >= 0);

ALTER TABLE "subscription" 
ADD CONSTRAINT "check_subscription_dates" CHECK (end_date >= start_date);

ALTER TABLE "loan" 
ADD CONSTRAINT "check_loan_dates" CHECK (access_end_date IS NULL OR access_end_date >= loan_date);