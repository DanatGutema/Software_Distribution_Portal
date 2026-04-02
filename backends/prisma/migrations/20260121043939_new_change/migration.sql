/*
  Warnings:

  - The `machineMode` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `machineType` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "machineMode",
ADD COLUMN     "machineMode" INTEGER,
DROP COLUMN "machineType",
ADD COLUMN     "machineType" INTEGER;
