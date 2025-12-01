/*
  Warnings:

  - You are about to drop the column `id_goal` on the `mealplan` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `mealplan` table. All the data in the column will be lost.
  - Added the required column `id_objective` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mealplan` DROP FOREIGN KEY `MealPlan_id_goal_fkey`;

-- DropIndex
DROP INDEX `MealPlan_id_goal_fkey` ON `mealplan`;

-- AlterTable
ALTER TABLE `mealplan` DROP COLUMN `id_goal`,
    DROP COLUMN `status`,
    ADD COLUMN `id_objective` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mealplanpatient` ADD COLUMN `status` ENUM('DRAFT', 'ACTIVE', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE `MealPlan` ADD CONSTRAINT `MealPlan_id_objective_fkey` FOREIGN KEY (`id_objective`) REFERENCES `Objective`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
