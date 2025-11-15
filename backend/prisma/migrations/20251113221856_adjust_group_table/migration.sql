/*
  Warnings:

  - You are about to drop the column `decription` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Group` DROP COLUMN `decription`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `picture` MEDIUMBLOB NULL;
