/*
  Warnings:

  - Added the required column `type` to the `GoalObjective` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add column with default value first
ALTER TABLE `GoalObjective` ADD COLUMN `type` ENUM('MAIN', 'SECONDARY') NOT NULL DEFAULT 'MAIN';

-- Update existing records to have appropriate type (you may want to adjust this based on your business logic)
UPDATE `GoalObjective` SET `type` = 'MAIN' WHERE `type` IS NULL OR `type` = 'MAIN';

-- Optionally, you could set some records to SECONDARY based on specific criteria
-- For example: UPDATE `GoalObjective` SET `type` = 'SECONDARY' WHERE some_condition;
