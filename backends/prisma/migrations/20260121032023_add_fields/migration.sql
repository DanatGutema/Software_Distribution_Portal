/*
  Warnings:

  - Added the required column `advanceNdc` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `machineMode` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `machineType` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatingSystem` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swd` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unifiedAgent` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xfs` to the `File` table without a default value. This is not possible if the table is not empty.
  - Made the column `keywords` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uploadedBy` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uploaderEmail` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "advanceNdc" TEXT NOT NULL,
ADD COLUMN     "bankName" TEXT NOT NULL,
ADD COLUMN     "machineMode" TEXT NOT NULL,
ADD COLUMN     "machineType" TEXT NOT NULL,
ADD COLUMN     "operatingSystem" TEXT NOT NULL,
ADD COLUMN     "swd" TEXT NOT NULL,
ADD COLUMN     "unifiedAgent" TEXT NOT NULL,
ADD COLUMN     "xfs" TEXT NOT NULL,
ALTER COLUMN "keywords" SET NOT NULL,
ALTER COLUMN "uploadedBy" SET NOT NULL,
ALTER COLUMN "uploaderEmail" SET NOT NULL;
