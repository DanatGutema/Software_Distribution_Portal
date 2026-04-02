/*
  Warnings:

  - Added the required column `machineModeId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `machineTypeId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "machineModeId" INTEGER NOT NULL,
ADD COLUMN     "machineTypeId" INTEGER NOT NULL;
