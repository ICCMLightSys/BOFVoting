const Store = require('./store.js');
const HttpResponseError = require('../httpResponseError');
const { ValidationError } = require('./errors');

function validateSession(sessionData) {
  if (sessionData == null || typeof sessionData !== 'object') {
    throw new ValidationError('Session data not found');
  }

  if (sessionData.name == null) {
    throw new ValidationError('Sessions must have a name');
  }
}

class SessionsStore extends Store {
  async exists(sessionId) {
    const result = await this.database.queryOne(
      'SELECT COUNT(*) AS rowCount FROM Sessions WHERE id = ?',
      [sessionId]
    );

    return result.rowCount >= 1;
  }

  async find(sessionId, includeVotesAndFacilitators = true) {
    const session = await this.database.queryOne(
      'SELECT id, name, description, conferenceId FROM Sessions WHERE id = ?',
      [sessionId]
    );

    if (includeVotesAndFacilitators) {
      await this.addVotesAndFacilitators(session);
    }

    return session;
  }

  async findAll(conferenceId, includeVotesAndFacilitators = true) {
    // TODO: investigate performance problems and revert back to this version
    // const sessions = await this.database.query(
    //   'SELECT id, name, description FROM Sessions WHERE conferenceId = 1',
    //   [conferenceId]
    // );
    //
    // if (includeVotesAndFacilitators) {
    //   await Promise.all(sessions.map(this.addVotesAndFacilitators.bind(this)));
    // }
    //
    // return sessions;

    if (includeVotesAndFacilitators) {
      return this.database.query(`
        SELECT Sessions.id, Sessions.name, Sessions.description, Sessions.forced, IFNULL(counter.facilitatorCount, 0) as facilitators, IFNULL(voteCounter.votes, 0) as votes
          FROM Sessions
          LEFT JOIN (
            SELECT sessionId, COUNT(*) AS facilitatorCount FROM Facilitators GROUP BY sessionId
          ) counter ON Sessions.id = counter.sessionId
          LEFT JOIN (
            SELECT sessionId, (yesCount + altCount * 0.25) as votes FROM
              (
                SELECT yesQuery.sessionId, yesCount, IFNULL(altCount, 0) AS altCount
                FROM (SELECT sessionId, COUNT(*) as yesCount FROM Votes WHERE voteType = 'Yes' GROUP BY sessionId) yesQuery
                LEFT JOIN (SELECT sessionId, COUNT(*) as altCount FROM Votes WHERE voteType = 'Alt' GROUP BY sessionId) altQuery
                ON yesQuery.sessionId = altQuery.sessionId
              UNION
                SELECT altQuery.sessionId, IFNULL(yesCount, 0) AS yesCount, altCount
                FROM (SELECT sessionId, COUNT(*) as yesCount FROM Votes WHERE voteType = 'Yes' GROUP BY sessionId) yesQuery
                RIGHT JOIN (SELECT sessionId, COUNT(*) as altCount FROM Votes WHERE voteType = 'Alt' GROUP BY sessionId) altQuery
                ON yesQuery.sessionId = altQuery.sessionId
              ) innerVoteCounter
          ) voteCounter on Sessions.id = voteCounter.sessionId
        WHERE Sessions.conferenceId = ?;
      `, [conferenceId]);
    } else {
      return this.database.query(
        'SELECT id, name, description, forced FROM Sessions WHERE conferenceId = ?',
        [conferenceId]
      );
    }
  }

  async findTopSessions(conferenceId, numSessions) {
    const sessions = this.findAll(conferenceId);

    const forcedSessions = sessions.filter(({ forced }) => forced);

    const numRemainingSessions = numSessions - forcedSessions.length;
    if (numRemainingSessions < 0) {
      const forcedSessionsString = forcedSessions.length === 1 ? `is 1 forced session` : `are ${forcedSessions.length} forced sessions`;
      return { error: `There ${forcedSessionsString} and only ${numSessions} time slot${numSessions === 1 ? '' : 's'}` };
    }

    const nonForcedSessions = sessions.filter(({ forced }) => !forced);
    // TODO Break ties
    nonForcedSessions.sort((a, b) => b.votes - a.votes);
    const topNonForcedSessions = nonForcedSessions.slice(0, numRemainingSessions);

    const topSessions = forcedSessions.concat(topNonForcedSessions);

    await Promise.all(topSessions.map(this.addVoteListsAndFacilitatorsList.bind(this)));

    return topSessions;
  }

  async addVoteListsAndFacilitatorsList(session) {
    const votes = await this.database.stores.votes.findForSession(session.id);

    const yesVotes = votes.filter(({ voteType }) => voteType === 'Yes');
    const altVotes = votes.filter(({ voteType }) => voteType === 'Alt');

    session.yesVoteUserIds = yesVotes.map(vote => vote.userId);
    session.altVoteUserIds = altVotes.map(vote => vote.userId);

    const facilitators = await this.database.stores.sessions.getFacilitators(session.id);
    session.facilitatorUsersIds = facilitators.map(facilitator => facilitator.userId);
  }

  async findAllFacilitatedBy(userId) {
    return await this.database.query(
      `SELECT Sessions.* FROM Sessions INNER JOIN Facilitators ON Sessions.id = Facilitators.sessionId WHERE Facilitators.userId = ?`,
      [userId]
    );
  }

  async addVotesAndFacilitators(session) {
    const votes = await this.database.stores.votes.findForSession(session.id);
    console.log(`Votes: ${JSON.stringify(votes)}`);

    const yesVotes = votes.filter(({ voteType }) => voteType === 'Yes').length;
    const altVotes = votes.filter(({ voteType }) => voteType === 'Alt').length;

    const facilitators = await this.database.stores.sessions.getFacilitators(session.id);

    session.votes = yesVotes + (altVotes * 0.25);
    session.facilitators = facilitators.length;
  }

  async insert(conferenceId, session) {
    validateSession(session);

    const result = await this.database.query(
      'INSERT INTO Sessions (name, description, conferenceId, forced) VALUES (?, ?, ?, ?)'
      , [session.name, session.description, conferenceId, 0]
    );

    return result.insertId;
  }

  update(sessionId, newData) {
    return this.database.query(
      'UPDATE Sessions SET name = ?, description = ? WHERE id = ?',
      [newData.name, newData.description, sessionId]
    );
  }

  async delete(sessionId) {
    await this.database.query('DELETE FROM Sessions WHERE id = ?', [sessionId]);
  }

  async merge(sourceSessionId, destinationSessionId) {
    const sourceSession = await this.find(sourceSessionId, true);
    const destinationSession = await this.find(destinationSessionId, true);

    if (sourceSession == null || destinationSession == null) {
      throw new HttpResponseError('NOT_FOUND', 'Session not found');
    }

    try {
      await this.database.query('START TRANSACTION');

      const newSessionData = {
        name: `${destinationSession.name} / ${sourceSession.name}`,
        description: `${destinationSession.description} / ${sourceSession.description}`,
      };

      await this.update(destinationSessionId, newSessionData);

      await this.database.query('UPDATE IGNORE Facilitators SET sessionId = ? WHERE sessionId = ?', [destinationSessionId, sourceSessionId]);

      // Ensure that for every vote for sourceSession there is a corresponding vote for the
      //   destination session, in order to prevent the next update query from breaking.
      await this.database.query(`
        INSERT INTO Votes (userId, sessionId, voteType)
        SELECT SourceVotes.userId, ?, SourceVotes.voteType
          FROM Votes AS SourceVotes
          WHERE SourceVotes.sessionId = ?
            AND (SELECT COUNT(*) FROM Votes AS DestinationVotes WHERE sessionId = ? AND userId = SourceVotes.userId) = 0
      `, [destinationSessionId, sourceSessionId, destinationSessionId]);

      // When two sessions have different votes by the same user, go with the highest vote value.
      await this.database.query(`
        UPDATE Votes AS DestinationVotes
          LEFT JOIN Votes AS SourceVotes ON SourceVotes.userId = DestinationVotes.userId
        SET DestinationVotes.voteType =
          IF(SourceVotes.voteType = 'Yes' OR DestinationVotes.voteType = 'Yes', 'Yes',
            IF(SourceVotes.voteType = 'Alt' OR DestinationVotes.voteType = 'Alt', 'Alt',
              'No'))
        WHERE SourceVotes.sessionId = ? AND DestinationVotes.sessionId = ?
      `, [sourceSessionId, destinationSessionId]);

      await this.delete(sourceSessionId);
    } catch (e) {
      await this.database.query('ROLLBACK');

      throw e;
    }

    await this.database.query('COMMIT');
  }

  async addFacilitator(sessionId, userId) {
    await this.database.query(
      'INSERT IGNORE INTO Facilitators (userId, sessionId) VALUES (?, ?)',
      [userId, sessionId]
    );
  }

  async removeFacilitator(sessionId, userId) {
    await this.database.query(
      'DELETE FROM Facilitators WHERE userId = ? AND sessionId = ?',
      [userId, sessionId]
    );
  }

  getFacilitators(sessionId) {
    return this.database.query(
      'SELECT userId, sessionId FROM Facilitators WHERE sessionId = ?',
      [sessionId]
    );
  }
}

module.exports = SessionsStore;
