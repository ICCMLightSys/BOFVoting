let Store = require('./store.js');

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

  async insert(conferenceId, session) {
    // TODO: validate session

    const result = await this.database.query(
      'INSERT INTO Sessions (name, description, conferenceId) VALUES (?, ?, ?)'
      , [session.name, session.description, conferenceId]
    );

    return result.insertId;
  }
}

module.exports = SessionsStore;
