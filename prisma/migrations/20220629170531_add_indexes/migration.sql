-- CreateIndex
CREATE INDEX "User_wallet_id_idx" ON "User"("wallet", "id");

-- CreateIndex
CREATE INDEX "Validations_validatorId_receiverId_skillId_idx" ON "Validations"("validatorId", "receiverId", "skillId");
