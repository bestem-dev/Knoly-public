-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "SugestedSkill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SugestedSkill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SugestedSkill" ADD CONSTRAINT "SugestedSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
