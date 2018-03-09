const Store = require('./store.js');

class FacilitatorsStore extends Store {
  async findAllBySession() {
    const sessions = await this.database.query(`
      SELECT DISTINCT Sessions.id AS sessionId
      FROM Sessions
        INNER JOIN Facilitators ON sessionId = Facilitators.sessionId
    `);

    // TODO: this code is confuddling but I don't want to clean it up right now
    return Promise.all(sessions.map(async ({ sessionId }) => ({
      sessionId,
      facilitators: (await this.database.query('SELECT userId FROM Facilitators WHERE sessionId = ?', [sessionId])).map(row => row.userId),
    })));
  }
}

module.exports = FacilitatorsStore;
