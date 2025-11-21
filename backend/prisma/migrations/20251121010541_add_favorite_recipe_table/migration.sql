/*
  Warnings:

  - You are about to drop the column `favorite` on the `food` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `food` DROP COLUMN `favorite`;

-- CreateTable
CREATE TABLE `FavoriteRecipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_recipe` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FavoriteRecipe_id_user_id_recipe_key`(`id_user`, `id_recipe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FavoriteRecipe` ADD CONSTRAINT `FavoriteRecipe_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteRecipe` ADD CONSTRAINT `FavoriteRecipe_id_recipe_fkey` FOREIGN KEY (`id_recipe`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
