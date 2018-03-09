
ALTER TABLE `Sessions` ADD COLUMN `forced` BOOL NOT NULL;
ALTER TABLE `Conferences` CHANGE `votingEnd` `votingEnd` DATETIME;
ALTER TABLE `Conferences` CHANGE `submissionStart` `submissionStart` DATETIME;
ALTER TABLE `Conferences` CHANGE `votingStart` `votingStart` DATETIME;
ALTER TABLE `Conferences` CHANGE `submissionEnd` `submissionEnd` DATETIME;
