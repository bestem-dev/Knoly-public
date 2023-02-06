-- DropIndex
DROP INDEX "User_wallet_id_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registered" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "User_wallet_id_email_idx" ON "User"("wallet", "id", "email");
