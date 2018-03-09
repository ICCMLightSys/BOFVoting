const express = require('express');
const { requireUserToBeAdmin } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');
const generateSchedule = require('../modules/scheduler');

const router = express.Router();

router.post('/conferences/:conferenceId/generateSchedule', requireAuthentication, requireUserToBeAdmin, async (req, res) => {
  // TODO Generate schedule
  const rooms = req.rooms.findAll(req.conferenceId);
  const times = req.times.findAll(req.conferenceId);
  const sessions = req.sessions.findTopSessions(req.conferenceId, rooms.length * times.length);

  await new Promise((resolve) => {
    generateSchedule(rooms, times, sessions, (pop, gen, stats) => {
      resolve({ pop, gen, stats });
    });
  });

  res.status(204).send();
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
