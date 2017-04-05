let express = require('express');
let router = express.Router();
let users = require('./users')

// Create a user (works)
router.post('/users', users.create)

// Verify the user by checking the auth token
router.post('/users/:id/verify', users.verify)

module.exports = router;
