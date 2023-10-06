-- CreateTable
CREATE TABLE "Discussion" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "content" STRING NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upvotes" INT4 NOT NULL DEFAULT 0,
    "downvotes" INT4 NOT NULL DEFAULT 0,
    "authorId" STRING NOT NULL,
    "closed" BOOL NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" STRING NOT NULL,
    "content" STRING NOT NULL,
    "authorId" STRING NOT NULL,
    "isCloseComment" BOOL NOT NULL DEFAULT false,
    "upvotes" INT4 NOT NULL DEFAULT 0,
    "downvotes" INT4 NOT NULL DEFAULT 0,
    "discussionId" STRING
);

-- CreateIndex
CREATE UNIQUE INDEX "Discussion_id_key" ON "Discussion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
