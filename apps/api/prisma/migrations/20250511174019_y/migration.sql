/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Mod` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Mod_name_key" ON "Mod"("name");
