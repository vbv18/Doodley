/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Room_ownerId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Room_ownerId_name_key" ON "Room"("ownerId", "name");
