-- AlterTable
ALTER TABLE `Recipe` MODIFY `portion` INTEGER NOT NULL DEFAULT 1,
    MODIFY `preparation_time` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nutritionist` ADD CONSTRAINT `Nutritionist_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
