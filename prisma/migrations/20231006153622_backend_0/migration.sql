-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "tags" STRING[] DEFAULT ARRAY[]::STRING[];
