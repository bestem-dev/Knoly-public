-- DropForeignKey
ALTER TABLE "SugestedSkill" DROP CONSTRAINT "SugestedSkill_userId_fkey";

-- DropForeignKey
ALTER TABLE "Validations" DROP CONSTRAINT "Validations_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Validations" DROP CONSTRAINT "Validations_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Validations" DROP CONSTRAINT "Validations_validatorId_fkey";

-- AddForeignKey
ALTER TABLE "Validations" ADD CONSTRAINT "Validations_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validations" ADD CONSTRAINT "Validations_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validations" ADD CONSTRAINT "Validations_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SugestedSkill" ADD CONSTRAINT "SugestedSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
