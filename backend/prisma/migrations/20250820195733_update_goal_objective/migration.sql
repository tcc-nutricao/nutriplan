/*
  Warnings:

  - You are about to drop the column `id_objective` on the `mealplan` table. All the data in the column will be lost.
  - Added the required column `id_goal` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `goal` DROP FOREIGN KEY `Goal_id_objective_fkey`;

-- DropForeignKey
ALTER TABLE `mealplan` DROP FOREIGN KEY `MealPlan_id_objective_fkey`;

-- DropIndex
DROP INDEX `Goal_id_objective_fkey` ON `goal`;

-- DropIndex
DROP INDEX `MealPlan_id_objective_fkey` ON `mealplan`;

-- AlterTable
ALTER TABLE `mealplan` DROP COLUMN `id_objective`,
    ADD COLUMN `id_goal` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `MealPlan` ADD CONSTRAINT `MealPlan_id_goal_fkey` FOREIGN KEY (`id_goal`) REFERENCES `Goal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
