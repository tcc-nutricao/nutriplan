/*
  Warnings:

  - A unique constraint covering the columns `[invite_code]` on the table `Nutritionist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `nutritionist` ADD COLUMN `invite_code` VARCHAR(191) NULL,
    ADD COLUMN `invite_code_expires_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Nutritionist_invite_code_key` ON `Nutritionist`(`invite_code`);
