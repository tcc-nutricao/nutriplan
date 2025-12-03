-- AlterTable
ALTER TABLE `recipe` ADD COLUMN `pref_meal_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_pref_meal_id_fkey` FOREIGN KEY (`pref_meal_id`) REFERENCES `Meal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
