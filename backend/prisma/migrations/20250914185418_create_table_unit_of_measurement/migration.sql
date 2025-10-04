/*
  Warnings:

  - Added the required column `id_unit_of_measurement` to the `FoodConsumed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FoodConsumed` ADD COLUMN `id_unit_of_measurement` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `UnitOfMeasurement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoodConsumed` ADD CONSTRAINT `FoodConsumed_id_unit_of_measurement_fkey` FOREIGN KEY (`id_unit_of_measurement`) REFERENCES `UnitOfMeasurement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
