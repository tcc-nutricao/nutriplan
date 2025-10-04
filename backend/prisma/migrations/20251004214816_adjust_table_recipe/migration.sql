/*
  Warnings:

  - You are about to drop the `RecipeGoal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `RecipeGoal` DROP FOREIGN KEY `RecipeGoal_id_goal_fkey`;

-- DropForeignKey
ALTER TABLE `RecipeGoal` DROP FOREIGN KEY `RecipeGoal_id_recipe_fkey`;

-- AlterTable
ALTER TABLE `Patient` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- DropTable
DROP TABLE `RecipeGoal`;

-- CreateTable
CREATE TABLE `RecipeObjective` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_objective` INTEGER NOT NULL,
    `id_recipe` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecipeObjective` ADD CONSTRAINT `RecipeObjective_id_objective_fkey` FOREIGN KEY (`id_objective`) REFERENCES `Objective`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeObjective` ADD CONSTRAINT `RecipeObjective_id_recipe_fkey` FOREIGN KEY (`id_recipe`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
