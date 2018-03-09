UPDATE `Sessions` SET `published` = 1 WHERE `published` IS NULL;
ALTER TABLE `Sessions` MODIFY COLUMN `published` BOOL NOT NULL DEFAULT 1;
