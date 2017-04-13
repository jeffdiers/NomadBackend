let express = require('express');
let router = express.Router();
let users = require('./users')

//talk to server
router.post('/talk', users.talk)

// User is logging in
router.post('/users/find', users.find)

// Create a user
router.post('/users/create', users.create)

// Edit a user
router.put('/users/:id/update', users.update)

// Verify the user by checking the auth token
router.post('/users/:id/verify', users.verify)

module.exports = router;
