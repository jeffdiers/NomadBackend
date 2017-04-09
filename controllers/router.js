let express = require('express');
let router = express.Router();
let users = require('./users')

//talk to server
router.post('/talk', users.talk)

// User is logging in
router.post('/users/find', users.find)

// Create a user (works)
router.post('/users/create', users.create)

// Verify the user by checking the auth token
router.post('/users/:id/verify', users.verify)

module.exports = router;
