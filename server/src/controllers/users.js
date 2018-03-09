const express = require('express');
const HttpResponseError = require('../httpResponseError.js');
const requireAuthentication = require('../middleware/authentication');
const { requireUserToBeAdmin } = require('../middleware/validation');

const router = express.Router();

router.get('/conferences/:conferenceId/users', requireAuthentication, requireUserToBeAdmin, async (req, res) => {
  const users = await req.users.findAllWithAccessTo(req.params.conferenceId);
  users.forEach((user) => { delete user.password; });

  res.status(200).send(users);
});

router.post('/users', async (req, res) => {
  if (await req.users.exists(req.body.username)) {
    throw new HttpResponseError('FORBIDDEN', 'There is already a user with that username');
  }

  let userData = {
    username: req.body.username,
    password: req.body.password,
  };

  const userId = await req.users.create(userData);
  const newUser = await req.users.find(userId);

  res.status(201).send(newUser);
});

// router.put('/users/password', async (req, res) => {
//   let email = req.authentication.email;
//   let user = await req.users.findByEmail(email);
//
//   let { oldPassword, newPassword } = req.body;
//
//   if (oldPassword == null || newPassword == null) {
//     throw new HttpResponseError('BAD_REQUEST', 'Invalid json received.  Expected: { oldPassword, newPassword }');
//   }
//
//   if (!await req.users.checkPassword(req.authentication.email, oldPassword)) {
//     throw new HttpResponseError('UNAUTHORIZED', 'The old password provided is not correct');
//   }
//
//   await req.users.changePassword(user.userId, newPassword);
//
//   res.status(200).send({ result: 'success' });
// });

router.use(require('../middleware/errorHandling'));

module.exports = router;
