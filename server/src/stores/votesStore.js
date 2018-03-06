const Store = require('./store');
const { ValidationError } = require('./errors.js');

const VOTE_TYPES = ['Yes', 'Alt', 'No'];

class VotesStore extends Store {
  async hasVoted(userId, sessionId) {
    const result = await this.database.query(
      'SELECT COUNT(*) AS numRows FROM Votes WHERE userId = ? AND sessionId = ?',
      [userId, sessionId]
    );

    return result[0].numRows >= 1;
  }

  async setVote(userId, sessionId, voteType) {
    if (!VOTE_TYPES.includes(voteType)) {
      throw new ValidationError(`Invalid vote type: ${voteType}`);
    }

    if (await this.hasVoted(userId, sessionId)) {
      return this.updateVote(userId, sessionId, voteType);
    } else {
      return this.createVote(userId, sessionId, voteType);
    }
  }

  async createVote(userId, sessionId, voteType) {
    await this.database.query(
      'INSERT INTO Votes (userId, sessionId, voteType) VALUES (?, ?, ?)',
      [userId, sessionId, voteType]
    );
  }

  async updateVote(userId, sessionId, voteType) {
    await this.database.query(
      'UPDATE Votes SET voteType = ? WHERE userId = ? AND sessionId = ?',
      [voteType, userId, sessionId]
    );
  }

  async findForUserAndConference(userId, conferenceId) {
    const votes = await this.database.query(`
      SELECT Votes.voteType, Sessions.id AS sessionId
      FROM Votes
        INNER JOIN Sessions ON Votes.sessionId = Sessions.id
      WHERE Votes.userId = ? AND conferenceId = ?
    `,
      [userId, conferenceId]
    );

    return votes.filter(vote => ['Yes', 'Alt'].includes(vote.voteType));
  }
}

module.exports = VotesStore;