-- AlterTable
ALTER TABLE "File" ADD COLUMN     "machineModeId" INTEGER,
ADD COLUMN     "machineTypeId" INTEGER,
ALTER COLUMN "machineMode" SET DATA TYPE TEXT,
ALTER COLUMN "machineType" SET DATA TYPE TEXT;
