-- CreateIndex
CREATE INDEX "User_surname_name_idx" ON "User"("surname", "name");

-- CreateIndex
CREATE INDEX "author_surname_idx" ON "author"("surname");

-- CreateIndex
CREATE INDEX "book_name_idx" ON "book"("name");

-- CreateIndex
CREATE INDEX "bookgenre_genre_id_idx" ON "bookgenre"("genre_id");

-- CreateIndex
CREATE INDEX "loan_user_id_status_idx" ON "loan"("user_id", "status");

-- CreateIndex
CREATE INDEX "subscription_user_id_status_idx" ON "subscription"("user_id", "status");
