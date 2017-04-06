let User = require('../models/User')

// Functions to create user, show verify, ect.
// Fits master tracker for multi-table 

exports.talk = function(req, res) {
    console.log(req.params.id)
    console.log(req.body)
    res.send({hello: 'hello'})
}

exports.create = function(req, res) {
    let params = req.body
    // Create new user based on form parameters
    let user = new User({
        name: params.name,
        email: params.email,
        phone: params.phoneNumber,
        countryCode: params.callingCode
    })
    console.log('----new-user-model---------')
    console.log(user)
    console.log('---------------------------')


    user.save(function(err, doc) {
        if(err) {
            res.send('something went wrong' + err)
            console.error('something went wrong saving the new user :(')
        } else {
            // If great succes in saving the user, send them a authy token
            user.sendAuthyToken(function(err) {
                if (err) {
                    console.error('couldnt send the token :(')
                }
                console.log('-----doc--------')
                console.log(doc)
                console.log('----------------')
                res.send({_id: user._id})
            })
        }
    })

    
}


exports.verify = function(req, res) {
    let user

    User.findById(req.params.id, function(err, doc) {
        if(err || !doc) {
            return die('User not found for this ID. :( ')
            console.error('User not found for this ID. :( ')
        }
        console.log(req.body)
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

            res.send('great success!')
        })
    }

    //respond with and err  
    function die(message) {
        res.send('errors' + message)
    }

}

