/*
  Warnings:

  - You are about to drop the column `favorite` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `MealPlanRecipe` ADD COLUMN `favorite` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Recipe` DROP COLUMN `favorite`;
