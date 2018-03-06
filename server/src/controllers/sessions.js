const express = require('express');
// const authentication = require('../modules/authentication.js');

const router = express.Router();
// router.post('/sessions', async (req, res) => {
//   let token = await authentication.signIn(req.body.email, req.body.password, req.users);
//
//   if (token) {
//     res.status(200).send({ result: 'success', token });
//   } else {
//     res.status(403).send({ result: 'failure' });
//   }
// });

router.get('/conferences/:conferenceId/sessions', async (req, res) => {
  let sessions = await req.sessions.findAll(req.params.conferenceId);

  // TODO: use real vote data
  sessions = sessions.map((session) => Object.assign({}, session, {
    votes: 0,
    facilitators: 0,
  }));

  res.status(200).send(sessions);
});

router.post('/conferences/:conferenceId/sessions', async (req, res) => {
  const newSessionId = await req.sessions.insert(req.params.conferenceId, req.body);
  const newSession = await req.sessions.find(newSessionId);

  res.status(201).send(newSession);
});

module.exports = router;
