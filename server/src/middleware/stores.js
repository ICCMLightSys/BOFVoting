const glob = require('glob');
const path = require('path');

const stores = {};

glob('./src/stores//**/*Store.js', {}, (err, files) => {
  if (err != null) {
    console.error(`Error while loading stores: ${err}`);
    return;
  }

  for (const storeFile of files) {
    const storeName = path.basename(storeFile, '.js').slice(0, -5);

    stores[storeName] = require(`../stores/${path.basename(storeName)}Store`);
  }
});

module.exports = function storesMiddleware(request, response, next) {
  Object.assign(request, stores);
  request.db.setStores(stores);

  next();
};
