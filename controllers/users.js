let User = require('../models/User')

// Functions to create user, show verify, ect.
// Fits master tracker for multi-table 

exports.talk = function(req, res) {
    console.log(req.params.id)
    console.log(req.body)
    res.send({hello: 'hello'})
}

exports.find = function(req, res) {
    let params = req.body
    let user
    console.log(params.email)

    User.findOne({ email: params.email}, function (err, doc) {
        if(err || !doc) {
            res.status(500).send('No user found with email ')
        }
        // If user is found send the user profile to client
        else {
            user = doc
            res.send(user)
        }

    })

}

exports.update = function(req, res) {
    
    User.findById(req.params.id, function(err, doc) {
        if(err || !doc) {
            res.status(500).send('couldnt update user')
            console.error('error updating user')
        } else {
            doc.email = req.body.email || doc.email
            doc.name = req.body.name || doc.name

            doc.save(function (err, user) {
                if (err) {
                    res.status(500).send(err)
                }
                res.send(user);
            });
        } 
    })

}

exports.create = function(req, res) {
    let params = req.body

    // Create new user based on form parameters
    let user = new User({
        name: params.name,
        email: params.email,
        phone: params.phoneNumber,
        countryCode: params.callingCode,
        isBarber: params.isBarber
    })

    user.save(function(err, doc) {
        if(err) {
            return die('something went wrong')
            console.error('something went wrong saving the new user :(')
        } else {
            // If great succes in saving the user, send them a authy token
            user.sendAuthyToken(function(err) {
                if (err) {
                    console.error('couldnt send the token :(')
                    console.error(err)
                    // return die('couldnt send the token :(')
                }
                res.send({_id: user._id})
            })
        }
    })

    function die(message) {
        res.status(500).send('errors! ' + message)
    }
    
}


exports.verify = function(req, res) {
    let user

    User.findById(req.params.id, function(err, doc) {
        if(err || !doc) {
            return die('User not found for this ID. :( ')
            console.error('User not found for this ID. :( ')
        }
        // If user is found, lets verify the token they entered
        user = doc
        user.verifyAuthyToken(req.body.code, postVerify)
    })

    // Update user info in db to show they are verified or send error message
    function postVerify(err) {
        if(err) {
            console.error('the token was invalid')
            return die('the token was invalid')
        }

        // If the token was valid, flip the bit to validate the user account
        user.verified = true
        user.save(postSave)
    }

    // After saving the user, send confirmation
    function postSave(err) {
        if(err) {
            console.error('There was a problem verifing the account')
            return die('There was a problem verifing the account')
        }

        // Send a success text message
        let message = `Hell yea! You did it, signup complete! :) ${user.name}`
        user.sendMessage(message, function(err) {
            if(err) {
                res.send('oops... error verifing :(')
            }

            res.send(user)
        })
    }

    //respond with and err  
    function die(message) {
        res.status(500).send('errors! ' + message)
    }

}

