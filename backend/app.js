var app = require('http');
var io = require('socket.io')(8000);
io.emit("asdf");