var socket = io('http://kingofthesketch.com:5000');


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function setStatusBox(message, type){
    $("#status-box").html("<div class='alert alert-"+type+"'>"+message+"</div>");
}

var name = "";

socket.on('connect', function () {
    console.log("dank");
});

socket.on("name taken", function(){
    setStatusBox("That name has already been taken.", "danger");
});

socket.on("name success", function(){
    setStatusBox("Successfully connected.", "success");

    $("#status-box").append("<h1>Successfully connected.</h1>");
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