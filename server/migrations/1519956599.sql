-- Migrations go in this folder.  Name files after the unix timestamp at time of creation.

CREATE TABLE Conferences (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    maxVotes INT NOT NULL DEFAULT 5,
    isArchived BOOL NOT NULL DEFAULT 0,
    invitationCode CHAR(5),
    colorScheme CHAR(6), -- hex string
    logo VARCHAR(255) NOT NULL,
    submissionStart DATETIME NOT NULL,
    submissionDeadline DATETIME NOT NULL,
    votingStart DATETIME NOT NULL,
    votingDeadline DATETIME NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Sessions (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    published BOOL,

    PRIMARY KEY (id)
);

CREATE TABLE Rooms (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Times (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    idx INT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Slots (
    roomId INT NOT NULL,
    timeId INT NOT NULL,
    sessionId INT NOT NULL,

    FOREIGN KEY (roomId) REFERENCES Rooms (id),
    FOREIGN KEY (timeId) REFERENCES Times (id),
    FOREIGN KEY (sessionId) REFERENCES Sessions (id),

    PRIMARY KEY (roomId, timeId, sessionId)
);

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isSiteAdmin BOOL NOT NULL DEFAULT 0,

    PRIMARY KEY (id)
);

CREATE TABLE ConferenceAdmins (
    conferenceId INT NOT NULL,
    userId INT NOT NULL,

    PRIMARY KEY (conferenceId, userId),

    FOREIGN KEY (conferenceId) REFERENCES Conferences (id),
    FOREIGN KEY (userId) REFERENCES Users (id)
);

CREATE TABLE Votes (
    userId INT NOT NULL,
    sessionId INT NOT NULL,
    voteType ENUM('Yes','Alt','No'),

    PRIMARY KEY (userId, sessionId),
    FOREIGN KEY (userId) REFERENCES Users (id),
    FOREIGN KEY (sessionId) REFERENCES Sessions (id)
);

CREATE TABLE Facilitators (
    userId INT NOT NULL,
    sessionId INT NOT NULL,

    PRIMARY KEY (userId, sessionId),
    FOREIGN KEY (userId) REFERENCES Users (id),
    FOREIGN KEY (sessionId) REFERENCES Sessions (id)
);

CREATE TABLE Permissions (
    userId INT NOT NULL,
    conferenceId INT NOT NULL,

    PRIMARY KEY (userId, conferenceId),
    FOREIGN KEY (userId) REFERENCES Users (id),
    FOREIGN KEY (conferenceId) REFERENCES Users (id)
);
