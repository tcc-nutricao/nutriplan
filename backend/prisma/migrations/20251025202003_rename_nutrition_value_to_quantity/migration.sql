/*
  Warnings:

  - You are about to drop the column `nutrition_value` on the `RecipeFood` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RecipeFood` DROP COLUMN `nutrition_value`,
    ADD COLUMN `quantity` DOUBLE NOT NULL DEFAULT 1;
