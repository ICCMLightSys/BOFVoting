let configuration = require('../../configuration.js');
let mysql = require('mysql');

class Database {
  constructor(connection) {
    this.connection = connection;
  }

  static connect() {
    return new Promise((resolve, reject) => {
      let connection = mysql.createConnection(configuration.database);

      connection.connect((error) => {
        if (error) {
          console.error("Error: couldn't connect to database.");
          reject(error);
          return;
        }

        resolve(new Database(connection));
      });
    });
  }

  query(queryString, queryValues) {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      let callback = (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        const endTime = Date.now();
        console.log(`${endTime - startTime} ms elapsed: '${queryString}'; ${JSON.stringify(queryValues)}`);

        resolve(results);
      };

      if (queryValues == null) {
        this.connection.query(queryString, callback);
      } else {
        this.connection.query(queryString, queryValues, callback);
      }
    });
  }

  queryOne(queryString, queryValues) {
    return this.query(queryString, queryValues).then(results => results[0]);
  }

  async runTransaction(callback) {
    await this.query('START TRANSACTION');

    try {
      await Promise.resolve(callback());
    } catch (e) {
      await this.query('ROLLBACK');

      throw e;
    }

    await this.query('COMMIT');
  }

  setStores(stores) {
    this.stores = stores;
  }

  close() {
    this.connection.end();
  }
}

module.exports = Database;
