/*
  Warnings:

  - A unique constraint covering the columns `[filename,bankId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_filename_bankId_key" ON "File"("filename", "bankId");
