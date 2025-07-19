-- CreateEnum
CREATE TYPE "Civility" AS ENUM ('MR', 'MME');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "civility" "Civility";

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "civility" "Civility";
