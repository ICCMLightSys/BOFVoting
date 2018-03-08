ALTER TABLE `Conferences` CHANGE `submissionDeadline` `submissionEnd` DATETIME NOT NULL;
ALTER TABLE `Conferences` CHANGE `votingDeadline` `votingEnd` DATETIME NOT NULL;

ALTER TABLE `Conferences` ADD COLUMN `year` YEAR NOT NULL;
ALTER TABLE `Conferences` ADD COLUMN `iccmEdition` VARCHAR(255) NOT NULL DEFAULT "USA";
