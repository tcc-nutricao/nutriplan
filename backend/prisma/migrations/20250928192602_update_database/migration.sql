/*
  Warnings:

  - Added the required column `portion` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preparation_time` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `portion` INTEGER NOT NULL,
    ADD COLUMN `preparation_time` INTEGER NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
