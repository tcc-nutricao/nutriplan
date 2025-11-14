/*
  Warnings:

  - You are about to drop the column `decription` on the `group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `group` DROP COLUMN `decription`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `picture` MEDIUMBLOB NULL;
