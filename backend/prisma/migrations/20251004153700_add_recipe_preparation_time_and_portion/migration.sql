-- Manually authored migration to add preparation_time and portion to Recipe
-- (Created without resetting existing data)

/*
  Adds two NOT NULL columns with safe defaults so existing rows are populated.
  Also aligns created_at default with schema if desired (optional step commented).
*/

ALTER TABLE `Recipe`
  ADD COLUMN `preparation_time` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `portion` INTEGER NOT NULL DEFAULT 1;

-- Optional: if you later want created_at default at DB level (only if not already set)
-- ALTER TABLE `Recipe` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
