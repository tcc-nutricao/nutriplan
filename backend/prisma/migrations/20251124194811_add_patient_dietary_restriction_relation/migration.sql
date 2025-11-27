-- CreateTable
CREATE TABLE `PatientDietaryRestriction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_patient` INTEGER NOT NULL,
    `id_dietary_restriction` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PatientDietaryRestriction` ADD CONSTRAINT `PatientDietaryRestriction_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientDietaryRestriction` ADD CONSTRAINT `PatientDietaryRestriction_id_dietary_restriction_fkey` FOREIGN KEY (`id_dietary_restriction`) REFERENCES `DietaryRestriction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
