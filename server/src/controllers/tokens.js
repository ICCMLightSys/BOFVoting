const express = require('express');
const authentication = require('../modules/authentication.js');

const router = express.Router();
router.post('/tokens', async (req, res) => {
  let token = await authentication.signIn(req.body.username, req.body.password, req.users);

  if (token) {
    res.status(200).send({ result: 'success', token });
  } else {
    res.status(403).send({ result: 'failure' });
  }
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
