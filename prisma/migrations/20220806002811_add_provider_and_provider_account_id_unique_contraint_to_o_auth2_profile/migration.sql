/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `OAuth2Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OAuth2Profile_provider_providerAccountId_key" ON "OAuth2Profile"("provider", "providerAccountId");
