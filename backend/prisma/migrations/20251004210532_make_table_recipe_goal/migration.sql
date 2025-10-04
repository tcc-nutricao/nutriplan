-- CreateTable
CREATE TABLE `RecipeGoal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_goal` INTEGER NOT NULL,
    `id_recipe` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecipeGoal` ADD CONSTRAINT `RecipeGoal_id_goal_fkey` FOREIGN KEY (`id_goal`) REFERENCES `Goal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeGoal` ADD CONSTRAINT `RecipeGoal_id_recipe_fkey` FOREIGN KEY (`id_recipe`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
