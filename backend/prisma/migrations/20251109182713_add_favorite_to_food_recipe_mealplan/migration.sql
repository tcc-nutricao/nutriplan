-- AlterTable
ALTER TABLE `Food` ADD COLUMN `favorite` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `MealPlan` ADD COLUMN `favorite` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `favorite` BOOLEAN NULL DEFAULT false;
