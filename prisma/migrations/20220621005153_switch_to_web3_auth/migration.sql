/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordSalt` on the `User` table. All the data in the column will be lost.
  - Made the column `wallet` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHash",
DROP COLUMN "passwordSalt",
ALTER COLUMN "wallet" SET NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;
