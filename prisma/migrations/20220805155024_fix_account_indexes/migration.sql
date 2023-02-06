-- DropIndex
DROP INDEX "Account_userId_idx";

-- CreateIndex
CREATE INDEX "Account_provider_providerAccountId_idx" ON "Account"("provider", "providerAccountId");
