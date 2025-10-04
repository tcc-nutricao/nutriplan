/*
  Warnings:

  - Added the required column `calories` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Corrigido case: tabela é `Recipe`
ALTER TABLE `Recipe` ADD COLUMN `calories` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `GoalObjective` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_goal` INTEGER NOT NULL,
    `id_objective` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GoalObjective` ADD CONSTRAINT `GoalObjective_id_goal_fkey` FOREIGN KEY (`id_goal`) REFERENCES `Goal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoalObjective` ADD CONSTRAINT `GoalObjective_id_objective_fkey` FOREIGN KEY (`id_objective`) REFERENCES `Objective`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
