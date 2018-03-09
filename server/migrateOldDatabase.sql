INSERT INTO Conferences (id, name, year, iccmEdition, isArchived)
SELECT archive_id, name, year, iccm_edition, 1
FROM bof_archive;
DELETE FROM Conferences
WHERE id=1;
INSERT INTO Conferences (id, name, year, iccmEdition, isArchived, maxVotes)
SELECT id, name, year, iccm_edition, 0, maxvotes
FROM bof_metadata;
INSERT INTO Sessions (id, conferenceId, name, description, published)
SELECT bof_id, archive_id, name, description, 1
FROM bof_archive_session;
INSERT INTO Sessions (id, conferenceId, name, description, published)
SELECT id + 100, 1, name, description, published
FROM workshop;
INSERT INTO Rooms (id, conferenceId, name)
SELECT id, 1, name
FROM location;
INSERT INTO Users (id, username, password, isSiteAdmin)
SELECT id, name, password, 0
FROM participant;
UPDATE Users set isSiteAdmin=1
WHERE id=1;
INSERT INTO Users (id, username, password, isSiteAdmin)
SELECT leader_id, leader, 'leaderPass', 0
FROM bof_archive_leader;
INSERT INTO Facilitators (userId, sessionId)
SELECT leader_id, bof_id
FROM bof_archive_leader;
INSERT INTO Permissions (userId, conferenceId)
SELECT id, 1
FROM Users;
INSERT INTO Times (id, conferenceId, name, idx)
SELECT id, 1, time_period, id
FROM round;
UPDATE Sessions set forced=0
WHERE id!=372;
UPDATE Sessions set forced=1
WHERE id=372;

UPDATE workshop_participant set participant=3
WHERE participant=0;
UPDATE workshop_participant set participant=2
WHERE participant=0.25;
INSERT INTO Votes (userId, sessionId, voteType)
SELECT participant_id, workshop_id, participant
FROM workshop_participant;
INSERT INTO Slots (roomId, timeId, sessionId)
SELECT location_id, round_id, id + 100
FROM workshop
WHERE location_id IS NOT NULL
AND round_id IS NOT NULL;
UPDATE Conferences set invitationCode='iccma'
WHERE id=1;