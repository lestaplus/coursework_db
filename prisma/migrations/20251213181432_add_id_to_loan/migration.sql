/*
  Warnings:

  - The primary key for the `loan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "loan" DROP CONSTRAINT "loan_pkey",
ADD COLUMN     "loan_id" SERIAL NOT NULL,
ADD CONSTRAINT "loan_pkey" PRIMARY KEY ("loan_id");
