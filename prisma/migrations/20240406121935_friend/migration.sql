/*
  Warnings:

  - You are about to drop the `InvitationLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_friendship` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "InvitationLink" DROP CONSTRAINT "InvitationLink_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_friendship" DROP CONSTRAINT "_friendship_A_fkey";

-- DropForeignKey
ALTER TABLE "_friendship" DROP CONSTRAINT "_friendship_B_fkey";

-- DropTable
DROP TABLE "InvitationLink";

-- DropTable
DROP TABLE "_friendship";

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "status" "FriendshipStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
