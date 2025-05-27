/*
  Warnings:

  - You are about to drop the `ServerMod` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serverId,name]` on the table `Mod` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serverId` to the `Mod` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServerMod" DROP CONSTRAINT "ServerMod_modId_fkey";

-- DropForeignKey
ALTER TABLE "ServerMod" DROP CONSTRAINT "ServerMod_serverId_fkey";

-- DropIndex
DROP INDEX "Mod_name_key";

-- AlterTable
ALTER TABLE "Mod" ADD COLUMN     "serverId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ServerMod";

-- CreateIndex
CREATE UNIQUE INDEX "Mod_serverId_name_key" ON "Mod"("serverId", "name");

-- AddForeignKey
ALTER TABLE "Mod" ADD CONSTRAINT "Mod_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
