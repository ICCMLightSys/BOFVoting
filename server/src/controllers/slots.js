const express = require('express');
const { requireUserToBeAdmin } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');
const generateSchedule = require('../modules/scheduler');

const router = express.Router();

router.post('/conferences/:conferenceId/generateSchedule', requireAuthentication, requireUserToBeAdmin, async (req, res) => {
  // TODO Generate schedule
  const conference = 0;
  const sessions = 0;

  await new Promise((resolve) => {
    generateSchedule(conference, sessions, (pop, gen, stats) => {
      resolve(pop, gen, stats);
    });
  });

  res.status(204).send();
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
