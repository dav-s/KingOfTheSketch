var app = require('http');
var io = require('socket.io')(8000);
io.on("connection", function(socket){
    console.log("connected");
});