-- DropIndex
DROP INDEX "User_wallet_id_email_idx";

-- DropIndex
DROP INDEX "Validations_validatorId_receiverId_skillId_idx";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "User_wallet_idx" ON "User" USING HASH ("wallet");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User" USING HASH ("email");

-- CreateIndex
CREATE INDEX "Validations_receiverId_idx" ON "Validations" USING HASH ("receiverId");
