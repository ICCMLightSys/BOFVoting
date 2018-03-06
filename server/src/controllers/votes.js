const express = require('express');
const router = express.Router();

const HttpResponseError = require('../httpResponseError');

const requireAuthentication = require('../middleware/authentication');

router.post('/conferences/:conferenceId/sessions/:sessionId/votes', requireAuthentication, async (req, res) => {
  if (!req.users.hasAccessTo(req.authentication.userId, req.params.conferenceId)) {
    throw new HttpResponseError('FORBIDDEN', 'User does not have access to that conference');
  }

  // TODO: validate vote type here or in model

  await req.votes.setVote(req.authentication.userId, req.params.conferenceId, req.body.voteType);

  res.status(201).send({ voteType: req.body.voteType });
});

router.get('/conferences/:conferenceId/votes', requireAuthentication, async (req, res) => {
  if (!req.users.hasAccessTo(req.authentication.userId, req.params.conferenceId)) {
    throw new HttpResponseError('FORBIDDEN', 'User does not have access to that conference');
  }

  const votes = await req.votes.findForUserAndConference(req.authentication.userId, req.params.conferenceId);

  res.status(200).send(votes);
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
