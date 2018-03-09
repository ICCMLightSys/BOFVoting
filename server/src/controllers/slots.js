const express = require('express');
const { requireUserToBeAdmin } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');
const generateSchedule = require('../modules/scheduler');

const router = express.Router();

router.post('/conferences/:conferenceId/generateSchedule', requireAuthentication, requireUserToBeAdmin, async (req, res) => {
  const rooms = await req.rooms.findAll(req.params.conferenceId);
  const times = await req.times.findAll(req.params.conferenceId);
  const sessions = await req.sessions.findTopSessions(req.params.conferenceId, rooms.length * times.length);
  const sessionsObject = sessions.reduce((map, obj) => {
    map[obj.id] = obj;
    return map;
  }, {});

  await new Promise((resolve) => {
    generateSchedule(rooms, times, sessionsObject, (pop, gen, stats) => {
      console.log(pop[0]);
      resolve({ pop, gen, stats });
    });
  });

  res.status(204).send();
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
