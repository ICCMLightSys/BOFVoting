const express = require('express');
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

router.use(require('../middleware/errorHandling'));

module.exports = router;
