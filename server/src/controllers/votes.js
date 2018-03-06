const express = require('express');
const { ensureUserHasAccessToConference } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');

const router = express.Router();

router.post('/conferences/:conferenceId/sessions/:sessionId/votes', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  // TODO: validate vote type here or in model

  await req.votes.setVote(req.authentication.userId, req.params.sessionId, req.body.voteType);
  res.status(201).send({ voteType: req.body.voteType });
});

router.get('/conferences/:conferenceId/votes', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  const votes = await req.votes.findForUserAndConference(req.authentication.userId, req.params.conferenceId);
  res.status(200).send(votes);
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
