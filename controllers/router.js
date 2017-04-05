var express = require('express');
var router = express.Router();
let users = require('./users')

/* GET home page. */
router.post('/v1/verifications', users.talk);

module.exports = router;
