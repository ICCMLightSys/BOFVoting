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
  const loadedStores = {};
  for (const storeName of Object.keys(stores)) {
    loadedStores[storeName] = new stores[storeName](request.db);
  }

  Object.assign(request, loadedStores);
  request.db.setStores(loadedStores);

  next();
};
