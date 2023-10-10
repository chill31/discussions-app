/*
  Warnings:

  - Added the required column `discussionTitle` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "discussionTitle" STRING NOT NULL;
