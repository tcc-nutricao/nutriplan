-- AlterTable
ALTER TABLE `MealPlan` ADD COLUMN `expiration_date` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `NutritionistPatient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_nutritionist` INTEGER NOT NULL,
    `id_patient` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NutritionistPatient` ADD CONSTRAINT `NutritionistPatient_id_nutritionist_fkey` FOREIGN KEY (`id_nutritionist`) REFERENCES `Nutritionist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NutritionistPatient` ADD CONSTRAINT `NutritionistPatient_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
