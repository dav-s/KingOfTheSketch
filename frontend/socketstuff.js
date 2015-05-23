var socket = io('http://kingofthesketch.com:5000');


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var name = "";

socket.on('connect', function () {
    console.log("dank");
});

socket.on("name taken", function(){
    $("body").append("<h1>That name has already been taken</h1>" +
    "<h2>Go back <a href='index.html'>home</a>.</h2>");
});

$(document).ready(function(){
    name = getParameterByName("name");
    console.log(name);
    if(name.length==0){
        //window.location="index.html";
    }
    $("body").append("<h1>"+name+"</h1>");
    socket.emit("connect name", name);
});