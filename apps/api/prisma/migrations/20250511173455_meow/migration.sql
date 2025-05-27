/*
  Warnings:

  - You are about to drop the `_ModToServer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `serverId` to the `Mod` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ModToServer" DROP CONSTRAINT "_ModToServer_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModToServer" DROP CONSTRAINT "_ModToServer_B_fkey";

-- DropIndex
DROP INDEX "Mod_name_key";

-- AlterTable
ALTER TABLE "Mod" ADD COLUMN     "serverId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ModToServer";

-- AddForeignKey
ALTER TABLE "Mod" ADD CONSTRAINT "Mod_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
