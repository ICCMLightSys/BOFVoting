const Store = require('./store.js');

class ConferencesStore extends Store {
  async exists(conferenceId) {
    const result = await this.database.queryOne(
      'SELECT COUNT(*) AS rowCount FROM Conferences WHERE id = ?',
      [conferenceId]
    );

    return result.rowCount >= 1;
  }
}

module.exports = ConferencesStore;
