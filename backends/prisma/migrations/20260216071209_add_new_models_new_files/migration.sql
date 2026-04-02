/*
  Warnings:

  - You are about to drop the column `advanceNdc` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `swd` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `unifiedAgent` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `xfs` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "advanceNdc",
DROP COLUMN "swd",
DROP COLUMN "unifiedAgent",
DROP COLUMN "xfs",
ADD COLUMN     "advanceNdcId" INTEGER,
ADD COLUMN     "swdId" INTEGER,
ADD COLUMN     "unifiedAgentId" INTEGER,
ADD COLUMN     "xfsId" INTEGER;

-- CreateTable
CREATE TABLE "AdvancedNDC" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdvancedNDC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SWD" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SWD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnifiedAgent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnifiedAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XFS" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XFS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedNDC_name_key" ON "AdvancedNDC"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SWD_name_key" ON "SWD"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnifiedAgent_name_key" ON "UnifiedAgent"("name");

-- CreateIndex
CREATE UNIQUE INDEX "XFS_name_key" ON "XFS"("name");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_swdId_fkey" FOREIGN KEY ("swdId") REFERENCES "SWD"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_advanceNdcId_fkey" FOREIGN KEY ("advanceNdcId") REFERENCES "AdvancedNDC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_xfsId_fkey" FOREIGN KEY ("xfsId") REFERENCES "XFS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_unifiedAgentId_fkey" FOREIGN KEY ("unifiedAgentId") REFERENCES "UnifiedAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
