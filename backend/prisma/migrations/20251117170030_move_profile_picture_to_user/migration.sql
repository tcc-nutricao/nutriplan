/*
  Warnings:

  - You are about to drop the column `profile_picture` on the `patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `patient` DROP COLUMN `profile_picture`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profile_picture` MEDIUMBLOB NULL;
