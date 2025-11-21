/*
  Warnings:

  - You are about to drop the `recipeobjective` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `recipeobjective` DROP FOREIGN KEY `RecipeObjective_id_objective_fkey`;

-- DropForeignKey
ALTER TABLE `recipeobjective` DROP FOREIGN KEY `RecipeObjective_id_recipe_fkey`;

-- DropTable
DROP TABLE `recipeobjective`;

-- CreateTable
CREATE TABLE `RecipePreference` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_preference` INTEGER NOT NULL,
    `id_recipe` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecipePreference` ADD CONSTRAINT `RecipePreference_id_preference_fkey` FOREIGN KEY (`id_preference`) REFERENCES `Preference`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipePreference` ADD CONSTRAINT `RecipePreference_id_recipe_fkey` FOREIGN KEY (`id_recipe`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
