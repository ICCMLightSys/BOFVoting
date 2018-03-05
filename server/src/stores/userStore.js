let bcrypt = require('bcrypt');
let { ValidationError, NotFoundError } = require('./errors.js');
let Store = require('./store.js');
let validator = require('validator');

const BCRYPT_SALT_ROUNDS = 10;

function validateUser(userData, expectPassword = true) {
  if (userData == null || typeof userData !== 'object') {
    throw new ValidationError('Data for new user not found');
  }

  if (userData.email == null) {
    throw new ValidationError('Users must have an email');
  }

  if (!validator.isEmail(userData.email)) {
    throw new ValidationError(userData.email + ' is not a valid email address');
  }

  if (expectPassword) {
    if (userData.password == null) {
      throw new ValidationError('Users must have a password');
    }
  }
}

class UserStore extends Store {
  async checkPassword(email, password) {
    let rows = await this.database.query('SELECT password FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return false;
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, rows[0].password, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  async create(userData) {
    validateUser(userData);

    let hashedPassword = await bcrypt.hash(userData.password, BCRYPT_SALT_ROUNDS);
    let result = await this.database.query('INSERT INTO Users (username, email, password) VALUES ("", ?, ?)', [userData.email, hashedPassword]);

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

  async exists(email) {
    let result = await this.database.query('SELECT COUNT(*) AS userCount FROM Users WHERE email = ?', [email]);

    return result[0].userCount >= 1;
  }

  async isMemberOf(userEmail, organizationId) {
    let result = await this.database.query(`
      SELECT COUNT(*) AS rowCount
      FROM OrganizationMap
        INNER JOIN Users ON Users.userId = OrganizationMap.userId
       WHERE Users.email = ? AND OrganizationMap.orgId = ?
    `, [userEmail, organizationId]);

    return result[0].rowCount >= 1;
  }
}

module.exports = UserStore;
