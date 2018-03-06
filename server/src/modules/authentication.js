let configuration = require('../../configuration.js');
let jwt = require('jsonwebtoken');

async function signIn(username, password, userStore) {
  try {
    const userId = await userStore.authenticate(username, password);

    if (userId === false) {
      return false;
    }

    return jwt.sign({
      username,
      userId,
      signedIn: true,
    }, configuration.authentication.encryptionKey);
  } catch (err) {
    console.log(`error: ${err.message}; returning false`);
    return false;
  }
}

function validate(jwtToken) {
  try {
    return jwt.verify(jwtToken, configuration.authentication.encryptionKey);
  } catch (e) {
    return false;
  }
}


module.exports = { signIn, validate };
