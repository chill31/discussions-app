-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "unlisted" BOOL NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Notification" (
    "forUserId" STRING NOT NULL,
    "fromUserId" STRING NOT NULL,
    "id" STRING NOT NULL,
    "discussionId" STRING NOT NULL,
    "content" STRING NOT NULL,
    "read" BOOL NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");
