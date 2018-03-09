const express = require('express');
const HttpResponseError = require('../httpResponseError');
const { ensureUserHasAccessToConference, requireUserToBeAdmin } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');

const router = express.Router();

router.get('/conferences/:conferenceId/sessions/facilitators', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  const sessions = await req.sessions.findAllFacilitatedBy(req.authentication.userId);

  res.status(200).send(sessions.map(session => session.id));
});

router.get('/conferences/:conferenceId/facilitators', requireAuthentication, requireUserToBeAdmin, async (req, res) => {
  const responseData = await req.facilitators.findAllBySession();

  res.status(200).send(responseData);
});

router.post('/conferences/:conferenceId/sessions/:sessionId/facilitate', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  if (typeof req.body !== 'object' || req.body.facilitate == null) {
    throw new HttpResponseError('BAD_REQUEST', 'Request body must include the facilitate property');
  }

  let userId = req.authentication.userId;
  if (await req.users.isAdmin(userId, req.params.conferenceId) && req.params.userId) {
    userId = req.params.userId;
  }

  if (req.body.facilitate) {
    await req.sessions.addFacilitator(req.params.sessionId, userId);
  } else {
    await req.sessions.removeFacilitator(req.params.sessionId, userId);
  }

  res.status(201).send({ userId, facilitate: req.body.facilitate });
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
