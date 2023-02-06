-- CreateTable
CREATE TABLE "ScrapedData" (
    "id" TEXT NOT NULL,
    "added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "data" JSONB,
    "proofOfKnolyId" TEXT,

    CONSTRAINT "ScrapedData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proofOfKnoly" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "accountId" TEXT,
    "scrapedDataId" TEXT NOT NULL,

    CONSTRAINT "proofOfKnoly_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScrapedData" ADD CONSTRAINT "ScrapedData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapedData" ADD CONSTRAINT "ScrapedData_proofOfKnolyId_fkey" FOREIGN KEY ("proofOfKnolyId") REFERENCES "proofOfKnoly"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proofOfKnoly" ADD CONSTRAINT "proofOfKnoly_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
