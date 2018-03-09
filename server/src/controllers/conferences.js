const express = require('express');
const { requireUserToBeAdmin, requireUserToBeSiteAdmin, ensureUserHasAccessToConference } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');

const router = express.Router();

router.get('/conferences', requireAuthentication, ensureUserHasAccessToConference, async (req, res) => {
  let conferences;

  if (req.users.isSiteAdmin(req.authentication.userId)) {
    conferences = await req.conferences.findAll();
  } else {
    conferences = await req.conferences.findAllAccessibleBy(req.authentication.userId);
  }

  res.status(200).send(conferences);
});

router.post('/conferences', requireAuthentication, requireUserToBeSiteAdmin, async (req, res) => {
  const conferenceId = await req.conferences.create(req.body);
  const newConference = await req.conferences.find(conferenceId);

  res.status(201).send(newConference);
});

router.patch('/conferences/:conferenceId', requireAuthentication, requireUserToBeAdmin, async (req, res) => {
  await req.conferences.update(req.params.conferenceId, req.body);

  const conference = await req.conferences.find(req.params.conferenceId);
  res.status(200).send(conference);
});

router.get('/conferences/:conferenceId/slots', requireAuthentication, requireUserToBeAdmin, async (req, res) => {
  const slots = await req.slots.findAll(req.params.conferenceId);

  res.status(200).send(slots);
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
