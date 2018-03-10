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

  async removeAll(conferenceId) {
    return this.database.query(`
      DELETE sl.* FROM Slots sl
      INNER JOIN Sessions se
      ON sl.conferenceId = se.conferenceId
      WHERE se.conferenceId = ?
    `, [conferenceId]
    );
  }

  async assignSessionsToSlots(sessions, rooms, times) {
    let values = [];
    for (let timeIndex = 0; timeIndex < times.length; timeIndex++) {
      for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
        values.push(`(${rooms[roomIndex].id},${times[timeIndex].id},${sessions[timeIndex * rooms.length + roomIndex]})`);
      }
    }
    return this.database.query(`
      INSERT INTO Slots (roomId,timeId,sessionId) VALUES${values.join(',')}
    `);
  }
}

module.exports = SlotsStore;
