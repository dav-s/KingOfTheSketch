var app = require('http');
var io = require('socket.io')(5000);
io.on("connection", function(socket){
    console.log(socket);
});