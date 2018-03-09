const Store = require('./store.js');

class SlotsStore extends Store {
  async findAll(conferenceId) {
    return this.database.query(`
      SELECT Slots.*, Sessions.conferenceId FROM Slots
        INNER JOIN Sessions ON Sessions.id = Slots.sessionId
      WHERE Sessions.conferenceId = ?
      `, [conferenceId]
    );
  }
}

module.exports = SlotsStore;
