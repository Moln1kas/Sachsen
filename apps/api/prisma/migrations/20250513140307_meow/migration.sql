/*
  Warnings:

  - You are about to drop the column `serverId` on the `Mod` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mod" DROP CONSTRAINT "Mod_serverId_fkey";

-- AlterTable
ALTER TABLE "Mod" DROP COLUMN "serverId";

-- CreateTable
CREATE TABLE "ServerMod" (
    "id" SERIAL NOT NULL,
    "serverId" INTEGER NOT NULL,
    "modId" INTEGER NOT NULL,

    CONSTRAINT "ServerMod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServerMod_serverId_modId_key" ON "ServerMod"("serverId", "modId");

-- AddForeignKey
ALTER TABLE "ServerMod" ADD CONSTRAINT "ServerMod_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMod" ADD CONSTRAINT "ServerMod_modId_fkey" FOREIGN KEY ("modId") REFERENCES "Mod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
