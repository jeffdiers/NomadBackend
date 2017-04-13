let mongoose = require('mongoose');
let config = require('../config');

// Create authenticated Authy and Twilio API clients
let authy = require('authy')(config.authyKey);
let twilioClient = require('twilio')(config.accountSid, config.authToken);

// Define user model schema
let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    countryCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    isBarber: {
        type: Boolean,
        default: false
    },
    authyId: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }
});

// Send a verification token to this user
UserSchema.methods.sendAuthyToken = function(cb) {
    let self = this;

    if (!self.authyId) {
        // Register this user if it's a new user
        authy.register_user(self.email, self.phone, self.countryCode, 
            function(err, response) {
                
            if (err || !response.user) return cb.call(self, err);
            self.authyId = response.user.id;
            self.save(function(err, doc) {
                if (err || !doc) return cb.call(self, err);
                self = doc;
                sendToken();
            });
        });
    } else {
        // Otherwise send token to a known user
        sendToken();
    }

    // With a valid Authy ID, send the 2FA token for this user
    function sendToken() {
        authy.request_sms(self.authyId, true, function(err, response) {
            cb.call(self, err);
        });
    }
};

// Test a 2FA token
UserSchema.methods.verifyAuthyToken = function(otp, cb) {
    let self = this;
    authy.verify(self.authyId, otp, function(err, response) {
        cb.call(self, err, response);
    });
};

// Send a text message via twilio to this user
UserSchema.methods.sendMessage = function(message, cb) {
    let self = this;
    twilioClient.sendMessage({
        to: self.countryCode+self.phone,
        from: config.twilioNumber,
        body: message
    }, function(err, response) {
        cb.call(self, err);
    });
};

// Export user model
module.exports = mongoose.model('User', UserSchema);