/*
  Warnings:

  - You are about to drop the column `machineMode` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `machineType` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedBy` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `uploaderEmail` on the `File` table. All the data in the column will be lost.
  - Added the required column `uploadedById` to the `File` table without a default value. This is not possible if the table is not empty.
  - Made the column `machineModeId` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `machineTypeId` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "machineMode",
DROP COLUMN "machineType",
DROP COLUMN "uploadedBy",
DROP COLUMN "uploaderEmail",
ADD COLUMN     "uploadedById" INTEGER NOT NULL,
ALTER COLUMN "machineModeId" SET NOT NULL,
ALTER COLUMN "machineTypeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_machineTypeId_fkey" FOREIGN KEY ("machineTypeId") REFERENCES "MachineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_machineModeId_fkey" FOREIGN KEY ("machineModeId") REFERENCES "MachineMode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
