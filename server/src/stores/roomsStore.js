const Store = require('./store.js');
const { ValidationError } = require('./errors');

function validateRoom(roomData) {
  if (typeof roomData.name !== 'string' || roomData.name.length === 0) {
    throw new ValidationError('A room must have a name');
  }
}

class RoomsStore extends Store {
  async exists(roomId) {
    const result = await this.database.queryOne(
      'SELECT COUNT(*) AS rowCount FROM Rooms WHERE id = ?',
      [roomId]
    );

    return result.rowCount >= 1;
  }

  async find(roomId) {
    return this.database.queryOne(
      'SELECT id, name, conferenceId FROM Rooms WHERE id = ?',
      [roomId]
    );
  }

  async findAll(conferenceId) {
    return this.database.query(
      'SELECT id, name, conferenceId FROM Rooms WHERE conferenceId = ?',
      [conferenceId]
    );
  }

  async create(conferenceId, roomData) {
    validateRoom(roomData);

    const result = await this.database.query(
      'INSERT INTO Rooms (name, conferenceId) VALUES (?, ?)',
      [roomData.name, conferenceId]
    );

    return result.insertId;
  }

  async update(roomId, roomData) {
    await this.database.query(
      'UPDATE Rooms SET name = ? WHERE id = ?',
      [roomData.name, roomId]
    );
  }

  async delete(roomId) {
    await this.database.query('DELETE FROM Rooms WHERE id = ?', [roomId]);
  }
}

module.exports = RoomsStore;
