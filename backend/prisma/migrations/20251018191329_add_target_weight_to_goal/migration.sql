-- AlterTable
ALTER TABLE `Goal` ADD COLUMN `target_weight` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Patient` ALTER COLUMN `updated_at` DROP DEFAULT;
