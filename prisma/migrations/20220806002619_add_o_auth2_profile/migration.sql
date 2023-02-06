-- CreateTable
CREATE TABLE "OAuth2Profile" (
    "id" TEXT NOT NULL,
    "email_verified" TEXT,
    "email" TEXT,
    "image" TEXT,
    "name" TEXT,
    "otherFields" JSONB,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,

    CONSTRAINT "OAuth2Profile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OAuth2Profile" ADD CONSTRAINT "OAuth2Profile_provider_providerAccountId_fkey" FOREIGN KEY ("provider", "providerAccountId") REFERENCES "Account"("provider", "providerAccountId") ON DELETE CASCADE ON UPDATE CASCADE;
