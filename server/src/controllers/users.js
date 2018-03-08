const express = require('express');
const HttpResponseError = require('../httpResponseError.js');
const requireAuthentication = require('../middleware/authentication');
const { requireUserToBeSiteAdmin } = require('../middleware/validation');

const router = express.Router();

router.get('/users', requireAuthentication, requireUserToBeSiteAdmin, async (req, res) => {
  const users = await req.users.findAll();
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

// Used to edit a user's information: their email, for example.  This route
//   is disabled for security reasons (currently it allows anyone to edit any
//   account), but it can be fixed and enabled in the future.
// router.put('/:id', async (req, res) => {
//   try {
//     await req.users.update(req.params.id, req.body);
//   } catch (e) {
//     res.status(400).send({ message: e.message || 'Error creating user' });
//     return;
//   }
//
//   res.status(200).send({ result: 'success' });
// });

// Used to change a user's password
router.put('/users/password', async (req, res) => {
  let email = req.authentication.email;
  let user = await req.users.findByEmail(email);

  let { oldPassword, newPassword } = req.body;

  if (oldPassword == null || newPassword == null) {
    throw new HttpResponseError('BAD_REQUEST', 'Invalid json received.  Expected: { oldPassword, newPassword }');
  }

  if (!await req.users.checkPassword(req.authentication.email, oldPassword)) {
    throw new HttpResponseError('UNAUTHORIZED', 'The old password provided is not correct');
  }

  await req.users.changePassword(user.userId, newPassword);

  res.status(200).send({ result: 'success' });
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
