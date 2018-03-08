const Store = require('./store.js');
const { ValidationError } = require('./errors');

function validateTime(timeData) {
  if (typeof timeData.name !== 'string' || timeData.name.length === 0) {
    throw new ValidationError('A time must have a name');
  }

  if (typeof timeData.idx !== 'number') {
    throw new ValidationError('A time must have an index');
  }
}

class TimesStore extends Store {
  async exists(timeId) {
    const result = await this.database.queryOne(
      'SELECT COUNT(*) AS rowCount FROM Times WHERE id = ?',
      [timeId]
    );

    return result.rowCount >= 1;
  }

  async find(timeId) {
    return this.database.queryOne(
      'SELECT id, name, idx, conferenceId FROM Times WHERE id = ?',
      [timeId]
    );
  }

  async findAll(conferenceId) {
    return this.database.query(
      'SELECT id, name, idx, conferenceId FROM Times WHERE conferenceId = ?',
      [conferenceId]
    );
  }

  async create(conferenceId, timeData) {
    validateTime(timeData);

    const result = await this.database.query(
      'INSERT INTO Times (name, idx, conferenceId) VALUES (?, ?, ?)',
      [timeData.name, timeData.idx, conferenceId]
    );

    return result.insertId;
  }

  async update(timeId, timeData) {
    validateTime(timeData);

    await this.database.query(
      'UPDATE Times SET name = ?, idx = ? WHERE id = ?',
      [timeData.name, timeData.idx, timeId]
    );
  }

  async delete(timeId) {
    await this.database.query('DELETE FROM Times WHERE id = ?', [timeId]);
  }
}

module.exports = TimesStore;
