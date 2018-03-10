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

  const scheduledSessions = await new Promise((resolve) => {
    generateSchedule(rooms, times, sessionsObject, (pop, gen) => {
      console.log(pop[0]);
      resolve(gen[0].entity);
    });
  });

  await req.slots.removeAll(req.params.conferenceId);
  await req.slots.assignSessionsToSlots(scheduledSessions, rooms, times);

  res.status(204).send();
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
