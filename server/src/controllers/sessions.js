const express = require('express');
const authentication = require('../modules/authentication.js');

const router = express.Router();
router.post('/sessions', async (req, res) => {
  let token = await authentication.signIn(req.body.email, req.body.password, req.users);

  if (token) {
    res.status(200).send({ result: 'success', token });
  } else {
    res.status(403).send({ result: 'failure' });
  }
});

module.exports = router;
