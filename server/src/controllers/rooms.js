const express = require('express');
const { ensureUserHasAccessToConference, requireUserToBeAdmin } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');

const router = express.Router();

router.get('/conferences/:conferenceId/rooms', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  const rooms = await req.rooms.findAll(req.params.conferenceId);

  res.status(200).send(rooms);
});

router.post('/conferences/:conferenceId/rooms', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  const newRoomId = await req.rooms.create(req.params.conferenceId, req.body);
  const newRoom = await req.rooms.find(newRoomId);

  res.status(201).send(newRoom);
});

router.patch('/conferences/:conferenceId/rooms/:roomId', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  await req.rooms.update(req.params.roomId, req.body);

  const editedRoom = await req.rooms.find(req.params.roomId);
  res.status(200).send(editedRoom);
});

router.delete('/conferences/:conferenceId/rooms/:roomId', requireAuthentication, ensureUserHasAccessToConference, requireUserToBeAdmin, async (req, res) => {
  await req.rooms.delete(req.params.roomId);

  res.status(204).send({ });
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
