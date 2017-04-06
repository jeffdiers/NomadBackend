let socket = require('socket.io')

module.exports = function(server) {
    var io = socket(server)

    io.on('connection', function (socket) {
        console.log('We have a connection')
    })
}