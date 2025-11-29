/*
  Warnings:

  - The values [GUEST] on the enum `UserGroup_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('STANDARD', 'PROFESSIONAL', 'GUEST') NOT NULL;

-- AlterTable
ALTER TABLE `usergroup` MODIFY `role` ENUM('ADMIN', 'MEMBER') NOT NULL;
