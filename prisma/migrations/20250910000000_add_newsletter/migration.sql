-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "newsletterSubscribed" BOOLEAN NOT NULL DEFAULT false;
