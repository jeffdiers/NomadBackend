var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/v1/verifications', function(req, res, next) {
  console.log('req that body')
  console.log(req.body)
  res.send('hi')
});

module.exports = router;
