const express = require('express');
const { HttpResponseError } = require('../httpResponseError');
const { ensureUserHasAccessToConference } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');

const router = express.Router();

router.get('/conferences/:conferenceId/sessions', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  let sessions = await req.sessions.findAll(req.params.conferenceId);

  // TODO: use real vote data
  sessions = sessions.map((session) => Object.assign({}, session, {
    votes: 0,
    facilitators: 0,
  }));

  res.status(200).send(sessions);
});

router.post('/conferences/:conferenceId/sessions', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  const newSessionId = await req.sessions.insert(req.params.conferenceId, req.body);
  const newSession = await req.sessions.find(newSessionId);

  res.status(201).send(newSession);
});

router.get('/conferences/:conferenceId/facilitate', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  const sessions = await req.sessions.findAllFacilitatedBy(req.authentication.userId);

  res.status(200).send(sessions.map(session => session.id));
});

router.post('/conferences/:conferenceId/sessions/:sessionId/facilitate', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  if (typeof req.body !== 'object' || req.body.facilitate == null) {
    throw new HttpResponseError('BAD_REQUEST', 'Request body must include the facilitate property');
  }

  if (req.body.facilitate) {
    await req.sessions.addFacilitator(req.params.sessionId, req.authentication.userId);
  } else {
    await req.sessions.removeFacilitator(req.params.sessionId, req.authentication.userId);
  }

  res.status(201).send({ facilitate: req.body.facilitate });
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
