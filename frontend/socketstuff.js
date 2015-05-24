var socket = io('http://kingofthesketch.com:5000');
//var socket = io('http://localhost:5000');


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function setStatusBox(message, type){
    $("#status-box").html("<div class='alert alert-"+type+" alert-dismissible'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+message+"</div>");
}

var name = "";
var isKing = false;
var isPeas = false;
var kingvotes=0;
var peasvotes=0;
var userqueue = [];

socket.on('connect', function () {
    console.log("dank");
});

socket.on("name taken", function(){
    setStatusBox("That name has already been taken.", "danger");
});

socket.on("name success", function(){
    setStatusBox("Successfully connected.", "success");
    $("#username-holder").html(name);
});

socket.on("update ui", function(data){
    $("#kingvote-count").html(data["kingvotes"]);
    $("#peasvote-count").html(data["peasvotes"]);
    kingvotes=data["kingvotes"];
    peasvotes=data["peasvotes"];
});

socket.on("need wait", function(time){
    setStatusBox("You need to wait "+(5-time/1000)+" seconds before voting again!","warning")
});

socket.on("update queue", function(queuelist){
    userqueue=queuelist;
    var html = '<tr><th>Position</th><th>Username</th></tr>';
    for(var i = 0; i<userqueue.length; i++){
        html+="<tr><td>"+(i+1)+"</td><td>"+userqueue[i]["name"]+"</td></tr>";
    }
    $("#queue-table").html(html);
    $("#king-name").html(userqueue[0].name);
    $("#peasant-name").html(userqueue[1]!=null ? userqueue[1].name : "NONE");
});


$(document).ready(function(){
    name = getParameterByName("name");
    console.log(name);
    if(name.length==0){
        //window.location="index.html";
    }
    
    socket.emit("connect name", name);

    $("#kingvote-button").click(function(){
        socket.emit("vote king");
    });
    $("#peasvote-button").click(function(){
        socket.emit("vote peas");
    });
});