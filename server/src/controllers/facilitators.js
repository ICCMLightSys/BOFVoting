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

  const { sessionId } = req.params;

  if (req.body.facilitate) {
    await req.db.runTransaction(() =>
      Promise.all([
        req.sessions.addFacilitator(sessionId, userId),
        req.votes.updateVote(userId, sessionId, 'Yes'),
      ])
    );
  } else {
    await req.sessions.removeFacilitator(sessionId, userId);
  }

  res.status(201).send({ userId, facilitate: req.body.facilitate });
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
