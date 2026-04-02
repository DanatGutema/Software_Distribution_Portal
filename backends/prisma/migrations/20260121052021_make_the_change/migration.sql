/*
  Warnings:

  - You are about to drop the column `machineModeId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `machineTypeId` on the `File` table. All the data in the column will be lost.
  - Made the column `keywords` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notes` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `advanceNdc` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankName` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `operatingSystem` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `swd` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unifiedAgent` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `xfs` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `machineMode` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `machineType` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "machineModeId",
DROP COLUMN "machineTypeId",
ALTER COLUMN "keywords" SET NOT NULL,
ALTER COLUMN "notes" SET NOT NULL,
ALTER COLUMN "advanceNdc" SET NOT NULL,
ALTER COLUMN "bankName" SET NOT NULL,
ALTER COLUMN "operatingSystem" SET NOT NULL,
ALTER COLUMN "swd" SET NOT NULL,
ALTER COLUMN "unifiedAgent" SET NOT NULL,
ALTER COLUMN "xfs" SET NOT NULL,
ALTER COLUMN "machineMode" SET NOT NULL,
ALTER COLUMN "machineType" SET NOT NULL;
