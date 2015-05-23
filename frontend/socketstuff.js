var socket = io('http://localhost:5000');

$(document).ready(function(){

});


socket.on('connect', function () {
        console.log("dank");
    }
);

