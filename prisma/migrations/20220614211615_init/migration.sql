-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Validations" (
    "validatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Validations_pkey" PRIMARY KEY ("validatorId","receiverId","skillId")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Validations" ADD CONSTRAINT "Validations_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validations" ADD CONSTRAINT "Validations_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validations" ADD CONSTRAINT "Validations_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
