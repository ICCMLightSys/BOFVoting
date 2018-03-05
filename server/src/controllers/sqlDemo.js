const express = require('express');
const router = express.Router();

router.get('/sqldemo', async (req, res) => {
  let result = await req.db.queryOne('SELECT 1 + 1 AS solution');

  res.send(result.solution.toString());
});

module.exports = router;
