let socketIO = require('socket.io');

module.exports = function(server) {
  let io = socketIO(server);
  
  io.on('connection', function (socket) {
        console.log('We have a connection')
  });

}