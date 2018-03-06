let bcrypt = require('bcrypt');
let { ValidationError, NotFoundError } = require('./errors.js');
let Store = require('./store.js');

const BCRYPT_SALT_ROUNDS = 10;

function validateUser(userData, expectPassword = true) {
  if (userData == null || typeof userData !== 'object') {
    throw new ValidationError('Data for new user not found');
  }

  if (userData.username == null) {
    throw new ValidationError('Users must have a username');
  }

  if (expectPassword) {
    if (userData.password == null) {
      throw new ValidationError('Users must have a password');
    }
  }
}

class UsersStore extends Store {
  async authenticate(username, password) {
    let rows = await this.database.query('SELECT password, id FROM Users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return false;
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, rows[0].password, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        if (result) {
          resolve(rows[0].id);
        } else {
          resolve(false);
        }
      });
    });
  }

  async create(userData) {
    validateUser(userData);

    let hashedPassword = await bcrypt.hash(userData.password, BCRYPT_SALT_ROUNDS);
    let result = await this.database.query('INSERT INTO Users (username, password) VALUES (?, ?)', [userData.username, hashedPassword]);

    return result.insertId;
  }

  async find(userId) {
    let results = await this.database.query('SELECT * from Users WHERE userId = ?', [userId]);

    if (results.length === 0) {
      throw new NotFoundError('User not found');
    }

    return results[0];
  }

  async findByEmail(userEmail) {
    let results = await this.database.query('SELECT * from Users WHERE email = ?', [userEmail]);

    if (results.length === 0) {
      throw new NotFoundError('User not found');
    }

    return results[0];
  }

  async update(userId, userData) {
    validateUser(userData, false);

    await this.database.query('UPDATE Users SET email = ? WHERE userId = ?', [userData.email, userId]);
  }

  async changePassword(userId, newPassword) {
    let newHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await this.database.query('UPDATE Users SET password = ? WHERE userId = ?', [newHash, userId]);
  }

  async exists(username) {
    const result = await this.database.query('SELECT COUNT(*) AS userCount FROM Users WHERE username = ?', [username]);

    return result[0].userCount >= 1;
  }

  async isAdmin(userId, conferenceId) {
    return await this.isSiteAdmin(userId) || await this.isConferenceAdmin(userId, conferenceId);
  }

  async isSiteAdmin(userId) {
    const result = await this.database.queryOne('SELECT isSiteAdmin FROM Users WHERE id = ?', [userId]);

    return result.isSiteAdmin === 1;
  }

  async isConferenceAdmin(userId, conferenceId) {
    const result = await this.database.query(
      'SELECT COUNT(*) as rowCount FROM ConferenceAdmins WHERE userId = ? AND conferenceId = ?',
      [userId, conferenceId]
    );

    return result[0].userCount >= 1;
  }

  async hasAccessTo(userId, conferenceId) {
    const result = await this.database.query(
      'SELECT COUNT(*) as rowCount FROM Permissions WHERE userId = ? AND conferenceId = ?',
      [userId, conferenceId]
    );

    return result[0].rowCount >= 1;
  }
}

module.exports = UsersStore;
