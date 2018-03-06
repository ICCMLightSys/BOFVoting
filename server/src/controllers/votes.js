const express = require('express');
const router = express.Router();

const HttpResponseError = require('../httpResponseError');

router.use(require('../middleware/authentication'));

router.post('/conferences/:conferenceId/sessions/:sessionId/votes', async (req, res) => {
  if (!req.users.hasAccessTo(req.authentication.userId, req.params.conferenceId)) {
    throw new HttpResponseError('FORBIDDEN', 'User does not have access to that conference');
  }

  await req.votes.setVote(req.authentication.userId, req.params.conferenceId, req.body.voteType);

  res.status(201).send({});
});

router.get('/conferences/:conferenceId/votes', async (req, res) => {
  if (!req.users.hasAccessTo(req.authentication.userId, req.params.conferenceId)) {
    throw new HttpResponseError('FORBIDDEN', 'User does not have access to that conference');
  }

  const votes = await req.votes.findForUserAndConference(req.authentication.userId, req.params.conferenceId);

  res.status(200).send(votes);
});

module.exports = router;
