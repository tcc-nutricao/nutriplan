/*
  Warnings:

  - You are about to drop the column `id_patient` on the `mealplan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `goal` DROP FOREIGN KEY `Goal_id_patient_fkey`;

-- DropForeignKey
ALTER TABLE `mealplan` DROP FOREIGN KEY `MealPlan_id_patient_fkey`;

-- DropIndex
DROP INDEX `Goal_id_patient_fkey` ON `goal`;

-- DropIndex
DROP INDEX `MealPlan_id_patient_fkey` ON `mealplan`;

-- AlterTable
ALTER TABLE `goal` MODIFY `id_patient` INTEGER NULL;

-- AlterTable
ALTER TABLE `mealplan` DROP COLUMN `id_patient`;

-- CreateTable
CREATE TABLE `MealPlanPatient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_meal_plan` INTEGER NOT NULL,
    `id_patient` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealPlanPatient` ADD CONSTRAINT `MealPlanPatient_id_meal_plan_fkey` FOREIGN KEY (`id_meal_plan`) REFERENCES `MealPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealPlanPatient` ADD CONSTRAINT `MealPlanPatient_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
