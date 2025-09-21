/*
  Warnings:

  - Added the required column `id_unit_of_measurement` to the `RecipeFood` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `recipefood` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `recipefood` ADD COLUMN `id_unit_of_measurement` INTEGER NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `RecipeFood` ADD CONSTRAINT `RecipeFood_id_unit_of_measurement_fkey` FOREIGN KEY (`id_unit_of_measurement`) REFERENCES `UnitOfMeasurement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
