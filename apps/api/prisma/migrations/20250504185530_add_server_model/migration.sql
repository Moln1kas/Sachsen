-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serverAddress" TEXT NOT NULL,
    "minecraftVersion" TEXT NOT NULL,
    "javaVersion" TEXT NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,

    CONSTRAINT "Mod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModToServer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ModToServer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_name_key" ON "Server"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Mod_name_key" ON "Mod"("name");

-- CreateIndex
CREATE INDEX "_ModToServer_B_index" ON "_ModToServer"("B");

-- AddForeignKey
ALTER TABLE "_ModToServer" ADD CONSTRAINT "_ModToServer_A_fkey" FOREIGN KEY ("A") REFERENCES "Mod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModToServer" ADD CONSTRAINT "_ModToServer_B_fkey" FOREIGN KEY ("B") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
