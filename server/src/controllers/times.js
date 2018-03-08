const express = require('express');
const { ensureUserHasAccessToConference, requireUserToBeAdmin } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');

const router = express.Router();

router.get('/conferences/:conferenceId/times', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  const times = await req.times.findAll(req.params.conferenceId);

  res.status(200).send(times);
});

router.post('/conferences/:conferenceId/times', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  const newtimeId = await req.times.create(req.params.conferenceId, req.body);
  const newtime = await req.times.find(newtimeId);

  res.status(201).send(newtime);
});

router.patch('/conferences/:conferenceId/times/:timeId', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  await req.times.update(req.params.timeId, req.body);

  const editedtime = await req.times.find(req.params.timeId);
  res.status(200).send(editedtime);
});

router.delete('/conferences/:conferenceId/times/:timeId', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  await req.times.delete(req.params.timeId);

  res.status(204).send({ });
});

module.exports = router;
