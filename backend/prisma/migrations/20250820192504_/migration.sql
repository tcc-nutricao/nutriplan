/*
  Warnings:

  - You are about to drop the column `id_nutricionist` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the `nutricionist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
-- Corrigido case: tabela é `MealPlan`
ALTER TABLE `MealPlan` DROP FOREIGN KEY `MealPlan_id_nutritionist_fkey`;

-- DropForeignKey
-- Corrigido case: tabela é `Patient`
ALTER TABLE `Patient` DROP FOREIGN KEY `Patient_id_nutricionist_fkey`;

-- DropIndex
-- Corrigido case: índice na tabela `MealPlan`
DROP INDEX `MealPlan_id_nutritionist_fkey` ON `MealPlan`;

-- DropIndex
-- Corrigido case: índice na tabela `Patient`
DROP INDEX `Patient_id_nutricionist_fkey` ON `Patient`;

-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `id_nutricionist`,
    ADD COLUMN `id_nutritionist` INTEGER NULL;

-- DropTable
-- Corrigido case: tabela original `Nutricionist`
DROP TABLE `Nutricionist`;

-- CreateTable
CREATE TABLE `Nutritionist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `professional_register` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Nutritionist_id_user_key`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_id_nutritionist_fkey` FOREIGN KEY (`id_nutritionist`) REFERENCES `Nutritionist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealPlan` ADD CONSTRAINT `MealPlan_id_nutritionist_fkey` FOREIGN KEY (`id_nutritionist`) REFERENCES `Nutritionist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
