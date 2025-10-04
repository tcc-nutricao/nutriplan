/*
  Warnings:

  - You are about to drop the column `id_meal` on the `FoodConsumed` table. All the data in the column will be lost.
  - You are about to drop the column `id_meal_plan` on the `MealPlanRecipe` table. All the data in the column will be lost.
  - Added the required column `id_meal_plan_meal` to the `FoodConsumed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_meal_plan_meal` to the `MealPlanRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `FoodConsumed` DROP FOREIGN KEY `FoodConsumed_id_meal_fkey`;

-- DropForeignKey
ALTER TABLE `MealPlanRecipe` DROP FOREIGN KEY `MealPlanRecipe_id_meal_plan_fkey`;

-- DropIndex
DROP INDEX `FoodConsumed_id_meal_fkey` ON `FoodConsumed`;

-- DropIndex
DROP INDEX `MealPlanRecipe_id_meal_plan_fkey` ON `MealPlanRecipe`;

-- AlterTable
ALTER TABLE `FoodConsumed` DROP COLUMN `id_meal`,
    ADD COLUMN `id_meal_plan_meal` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `MealPlanRecipe` DROP COLUMN `id_meal_plan`,
    ADD COLUMN `id_meal_plan_meal` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `MealPlanRecipe` ADD CONSTRAINT `MealPlanRecipe_id_meal_plan_meal_fkey` FOREIGN KEY (`id_meal_plan_meal`) REFERENCES `MealPlanMeal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodConsumed` ADD CONSTRAINT `FoodConsumed_id_meal_plan_meal_fkey` FOREIGN KEY (`id_meal_plan_meal`) REFERENCES `MealPlanMeal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
