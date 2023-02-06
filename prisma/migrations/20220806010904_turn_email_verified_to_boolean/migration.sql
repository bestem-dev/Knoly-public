/*
  Warnings:

  - The `email_verified` column on the `OAuth2Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OAuth2Profile" DROP COLUMN "email_verified",
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false;
