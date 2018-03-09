const Store = require('./store.js');

class FacilitatorsStore extends Store {
  async findAllBySession() {
    const sessions = await this.database.query(`
      SELECT DISTINCT Sessions.id AS sessionId
      FROM Sessions
        INNER JOIN Facilitators ON sessionId = Facilitators.sessionId
    `);

    const sessionIds = sessions.map(({ sessionId }) => sessionId);
    const userIdResult = await this.database.query(
      'SELECT userId, sessionId FROM Facilitators WHERE sessionId IN (?)',
      [sessionIds]
    );

    return sessionIds.map(sessionId =>
      ({
        sessionId,
        facilitators: userIdResult
          .filter(row => row.sessionId === sessionId)
          .map(row => row.userId),
      })
    );
  }
}

module.exports = FacilitatorsStore;
