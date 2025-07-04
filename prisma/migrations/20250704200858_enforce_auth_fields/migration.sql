/*
  Warnings:

  - Made the column `provider` on table `account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `providerAccountId` on table `account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sessionToken` on table `session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expires` on table `session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "account" ALTER COLUMN "provider" SET NOT NULL,
ALTER COLUMN "providerAccountId" SET NOT NULL;

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "sessionToken" SET NOT NULL,
ALTER COLUMN "expires" SET NOT NULL;
