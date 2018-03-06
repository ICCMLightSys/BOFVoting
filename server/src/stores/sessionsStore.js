let Store = require('./store.js');

let { ValidationError } = require('./errors');

function validateSession(sessionData) {
  if (sessionData == null || typeof sessionData !== 'object') {
    throw new ValidationError('Session data not found');
  }

  if (sessionData.name == null) {
    throw new ValidationError('Sessions must have a name');
  }
}

class SessionsStore extends Store {
  async find(sessionId) {
    return await this.database.query(
      'SELECT id, name, description FROM Sessions WHERE id = ?',
      [sessionId]
    );
  }

  async findAll(conferenceId) {
    return await this.database.query(
      'SELECT id, name, description FROM Sessions WHERE conferenceId = 1',
      [conferenceId]
    );
  }

  async findAllFacilitatedBy(userId) {
    return await this.database.query(
      `SELECT Sessions.* FROM Sessions INNER JOIN Facilitators ON Sessions.id = Facilitators.sessionId WHERE Facilitators.userId = ?`,
      [userId]
    );
  }

  async insert(conferenceId, session) {
    validateSession(session);

    const result = await this.database.query(
      'INSERT INTO Sessions (name, description, conferenceId) VALUES (?, ?, ?)'
      , [session.name, session.description, conferenceId]
    );

    return result.insertId;
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
}

module.exports = SessionsStore;
