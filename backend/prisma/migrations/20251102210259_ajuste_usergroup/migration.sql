/*
  Warnings:

  - You are about to drop the `PatientGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PatientGroup` DROP FOREIGN KEY `PatientGroup_id_group_fkey`;

-- DropForeignKey
ALTER TABLE `PatientGroup` DROP FOREIGN KEY `PatientGroup_id_patient_fkey`;

-- DropTable
DROP TABLE `PatientGroup`;

-- CreateTable
CREATE TABLE `UserGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_group` INTEGER NOT NULL,
    `role` ENUM('ADMIN', 'MEMBER', 'GUEST') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserGroup` ADD CONSTRAINT `UserGroup_id_group_fkey` FOREIGN KEY (`id_group`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroup` ADD CONSTRAINT `UserGroup_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
