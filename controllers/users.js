let User = require('../models/User')

// Functions to create user, show verify, ect.
// Fits master tracker for multi-table 
exports.talk = function(req, res, next) {
  console.log('req that body')
  console.log(req.body)
  res.send('hi')
}