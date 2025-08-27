/*
  Warnings:

  - You are about to drop the column `id_dietary_resctriction` on the `mealplandietaryrestriction` table. All the data in the column will be lost.
  - Added the required column `id_dietary_restriction` to the `MealPlanDietaryRestriction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mealplandietaryrestriction` DROP FOREIGN KEY `MealPlanDietaryRestriction_id_dietary_resctriction_fkey`;

-- DropIndex
DROP INDEX `MealPlanDietaryRestriction_id_dietary_resctriction_fkey` ON `mealplandietaryrestriction`;

-- AlterTable
ALTER TABLE `mealplandietaryrestriction` DROP COLUMN `id_dietary_resctriction`,
    ADD COLUMN `id_dietary_restriction` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `MealPlanDietaryRestriction` ADD CONSTRAINT `MealPlanDietaryRestriction_id_dietary_restriction_fkey` FOREIGN KEY (`id_dietary_restriction`) REFERENCES `DietaryRestriction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
