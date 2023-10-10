-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "downvotedBy" STRING[] DEFAULT ARRAY[]::STRING[];
ALTER TABLE "Comment" ADD COLUMN     "upvotedBy" STRING[] DEFAULT ARRAY[]::STRING[];

-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "downvotedBy" STRING[] DEFAULT ARRAY[]::STRING[];
ALTER TABLE "Discussion" ADD COLUMN     "upvotedBy" STRING[] DEFAULT ARRAY[]::STRING[];
