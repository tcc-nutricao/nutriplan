/*
  Warnings:

  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserGroup` DROP FOREIGN KEY `UserGroup_id_group_fkey`;

-- DropTable
DROP TABLE `UserGroup`;

-- CreateTable
CREATE TABLE `PatientGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_patient` INTEGER NOT NULL,
    `id_group` INTEGER NOT NULL,
    `role` ENUM('ADMIN', 'MEMBER', 'GUEST') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PatientGroup` ADD CONSTRAINT `PatientGroup_id_group_fkey` FOREIGN KEY (`id_group`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientGroup` ADD CONSTRAINT `PatientGroup_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
