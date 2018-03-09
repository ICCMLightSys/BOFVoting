const express = require('express');
const { ensureUserHasAccessToConference, requireUserToBeAdmin } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');

const router = express.Router();

router.get('/conferences/:conferenceId/sessions', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  let sessions = await req.sessions.findAll(req.params.conferenceId);

  res.status(200).send(sessions);
});

router.post('/conferences/:conferenceId/sessions', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  const newSessionId = await req.sessions.insert(req.params.conferenceId, req.body);
  const newSession = await req.sessions.find(newSessionId);

  res.status(201).send(newSession);
});

router.post('/conferences/:conferenceId/sessions/merge', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  const { sourceSessionId, destinationSessionId } = req.body;
  await req.sessions.merge(sourceSessionId, destinationSessionId);

  const mergedSession = await req.sessions.find(destinationSessionId, true);
  res.status(200).send(mergedSession);
});

router.patch('/conferences/:conferenceId/sessions/:sessionId', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  await req.sessions.update(req.params.sessionId, req.body);

  const editedSession = await req.sessions.find(req.params.sessionId);
  res.status(200).send(editedSession);
});

router.delete('/conferences/:conferenceId/sessions/:sessionId', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  await req.sessions.delete(req.params.sessionId);

  res.status(204).send({ });
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
