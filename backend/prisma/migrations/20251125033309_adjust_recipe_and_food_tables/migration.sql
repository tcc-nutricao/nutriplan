-- AlterTable
ALTER TABLE `food` ADD COLUMN `base_qty` DOUBLE NOT NULL DEFAULT 100,
    ADD COLUMN `base_unit` VARCHAR(191) NOT NULL DEFAULT 'g';

-- AlterTable
ALTER TABLE `recipe` ADD COLUMN `calories` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `preparation_method` VARCHAR(2000) NULL;

-- CreateTable
CREATE TABLE `FoodPortion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_food` INTEGER NOT NULL,
    `id_unit_of_measurement` INTEGER NOT NULL,
    `gram_weight` DOUBLE NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoodPortion` ADD CONSTRAINT `FoodPortion_id_food_fkey` FOREIGN KEY (`id_food`) REFERENCES `Food`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoodPortion` ADD CONSTRAINT `FoodPortion_id_unit_of_measurement_fkey` FOREIGN KEY (`id_unit_of_measurement`) REFERENCES `UnitOfMeasurement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
