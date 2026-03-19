-- DropForeignKey
ALTER TABLE "Mod" DROP CONSTRAINT "Mod_serverId_fkey";

-- AddForeignKey
ALTER TABLE "Mod" ADD CONSTRAINT "Mod_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
