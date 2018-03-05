let Database = require('../modules/database.js');

// TODO: connection pools?
module.exports = function (request, response, next) {
  request.db = new Database(null);
  next();

  // TODO: actually connect
  // Database.connect()
  //   .then(connection => {
  //     request.db = connection;
  //
  //     request.on('end', () => {
  //       request.db.close();
  //     });
  //
  //     next();
  //   })
  //   .catch(next);
};
