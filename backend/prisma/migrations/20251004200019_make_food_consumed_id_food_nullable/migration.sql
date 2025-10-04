-- DropForeignKey
ALTER TABLE `FoodConsumed` DROP FOREIGN KEY `FoodConsumed_id_food_fkey`;

-- DropIndex
DROP INDEX `FoodConsumed_id_food_fkey` ON `FoodConsumed`;

-- AlterTable
ALTER TABLE `FoodConsumed` MODIFY `id_food` INTEGER NULL;

-- AlterTable
ALTER TABLE `Recipe` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `FoodConsumed` ADD CONSTRAINT `FoodConsumed_id_food_fkey` FOREIGN KEY (`id_food`) REFERENCES `Food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
