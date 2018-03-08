const express = require('express');
const { requireUserToBeAdmin } = require('../middleware/validation');
const requireAuthentication = require('../middleware/authentication');

const router = express.Router();

router.post('/conferences/:conferenceId/generateSchedule', requireAuthentication, requireUserToBeAdmin, async (req, res) => {
  // TODO Generate schedule

  res.status(204).send();
});

router.use(require('../middleware/errorHandling'));

module.exports = router;
