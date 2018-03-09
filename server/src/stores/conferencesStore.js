const tokenGenerator = require('generate-password');
const { ValidationError } = require('./errors.js');
const Store = require('./store.js');

const DATETIME_FIELDS = ['submissionStart', 'submissionEnd', 'votingStart', 'votingEnd'];

function validateConference(conferenceData) {
  if (conferenceData == null || typeof conferenceData !== 'object') {
    throw new ValidationError('Data for conference not found');
  }

  const { name, maxVotes, isArchived } = conferenceData;

  if (typeof name !== 'string' || name.length === 0) {
    throw new ValidationError('Conferences must have a name');
  }

  if (typeof maxVotes !== 'number') {
    throw new ValidationError('maxVotes must be a number');
  }

  if (!(isArchived == '0' || isArchived == '1')) {
    throw new ValidationError('isArchived must be a boolean bit value');
  }

  for (const field of DATETIME_FIELDS) {
    if (Number.isNaN(Date.parse(conferenceData[field]))) {
      throw new ValidationError(`${field} must be a valid date and time`);
    }
  }
}

function standardizeDate(originalDate) {
  const parsedDate = Date.parse(originalDate);

  if (Number.isNaN(parsedDate)) {
    return null;
  } else {
    return new Date(parsedDate).toISOString().slice(0, 19).replace('T', ' ');
  }
}

function standardizeDates(conferenceData) {
  for (const field of DATETIME_FIELDS) {
    if (conferenceData.hasOwnProperty(field)) {
      conferenceData[field] = standardizeDate(conferenceData[field]);
    }
  }
}

class ConferencesStore extends Store {
  async exists(conferenceId) {
    const result = await this.database.queryOne(
      'SELECT COUNT(*) AS rowCount FROM Conferences WHERE id = ?',
      [conferenceId]
    );

    return result.rowCount >= 1;
  }

  async create(conferenceData) {
    validateConference(conferenceData);
    standardizeDates(conferenceData);

    const invitationCode = tokenGenerator.generate({
      length: 5,
      numbers: true,
    });

    const result = await this.database.query(`
      INSERT INTO Conferences (
        name, maxVotes, isArchived, invitationCode, submissionStart, submissionEnd, votingStart, votingEnd
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      conferenceData.name,
      conferenceData.maxVotes,
      conferenceData.isArchived,
      invitationCode,
      conferenceData.submissionStart,
      conferenceData.submissionEnd,
      conferenceData.votingStart,
      conferenceData.votingEnd,
    ]);

    return result.insertId;
  }

  find(conferenceId) {
    return this.database.queryOne('SELECT * FROM Conferences WHERE id = ?', [conferenceId]);
  }

  findAll() {
    return this.database.query('SELECT * FROM Conferences');
  }

  async findAllAccessibleBy(userId) {
    return this.database.query(`
      SELECT Conferences.*
      FROM Conferences
        INNER JOIN Permissions ON Conferences.id = Permissions.conferenceId
      WHERE Permissions.userId = ?
     `, [userId]);
  }

  async update(conferenceId, conferenceData) {
    standardizeDates(conferenceData);

    const oldConference = await this.find(conferenceId);
    const updatedFields = [];

    for (const conferenceProperty of Object.keys(oldConference)) {
      if (conferenceData.hasOwnProperty(conferenceProperty) && oldConference[conferenceProperty] !== conferenceData[conferenceProperty]) {
        updatedFields.push({
          name: conferenceProperty,
          newValue: conferenceData[conferenceProperty],
        });
      }
    }

    if (updatedFields.length === 0) {
      return;
    }

    const updatedFieldPlaceholders = updatedFields.map(({ name }) => `${name} = ?`);
    const updatedFieldValues = updatedFields.map(field => field.newValue);

    const queryString = `UPDATE Conferences SET ${updatedFieldPlaceholders.join(', ')} WHERE id = ?`;

    await this.database.query(queryString, updatedFieldValues.concat([conferenceId]));
  }
}

module.exports = ConferencesStore;
