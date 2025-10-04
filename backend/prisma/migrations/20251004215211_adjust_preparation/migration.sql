/*
  Warnings:

  - You are about to drop the column `description` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Patient` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Recipe` DROP COLUMN `description`,
    ADD COLUMN `preparation_method` VARCHAR(191) NULL;
