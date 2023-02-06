-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('unregistered', 'registered');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT E'unregistered';
