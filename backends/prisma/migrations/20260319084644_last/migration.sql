/*
  Warnings:

  - You are about to drop the column `remark` on the `AdvancedNDC` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `SWD` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `UnifiedAgent` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `XFS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdvancedNDC" DROP COLUMN "remark";

-- AlterTable
ALTER TABLE "SWD" DROP COLUMN "remark";

-- AlterTable
ALTER TABLE "UnifiedAgent" DROP COLUMN "remark";

-- AlterTable
ALTER TABLE "XFS" DROP COLUMN "remark";
