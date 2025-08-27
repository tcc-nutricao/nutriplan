/*
  Warnings:

  - Added the required column `calories` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mealplan` ADD COLUMN `calories` INTEGER NOT NULL;
