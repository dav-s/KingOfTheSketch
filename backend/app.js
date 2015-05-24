var io = require('socket.io')(5000);
// id -> json

var seconds_to_wait = 5;
var seconds_duration = 90;

var users = {};


var kingvotes= 0, peasvotes= 0;
var kingid, peasid;
var kingink= 0, peasink=0;

var kingpic = [];
var peaspic = [];

var queuedusers = [];

var starttime=Date.now();
var gamegoing=false;

function geIDrFromName(name){
    var keys = Object.keys(users);
    for(var i = 0; i<keys.length; i++){
        var cuser = users[keys[i]];
        //console.log(cuser);
        if(cuser["name"]==name){
            return keys[i];
        }
    }
    return null;
}

io.on("connection", function(socket){
    console.log(socket.id);
    socket.on("connect name", function (name) {
        if(geIDrFromName(name)==null){
            users[socket.id]= {name:name};
            socket.emit("name success");
            queuedusers.push(socket.id);
            updateQueue();
            updateTimer();
            if(gamegoing){
                socket.emit("king update", kingpic);
                socket.emit("peas update", peaspic);
                socket.emit("update ui", getGameState());
                socket.emit("game start");
            }
        }else{
            socket.emit("name taken");
        }
    });
    socket.on("disconnect", function(){
        console.log("dis "+socket.id);
        if(users[socket.id]!=null){
            delete users[socket.id];
        }
        for(var i = 0; i < queuedusers.length; i++){
            if(queuedusers[i]==socket.id){
                queuedusers.splice(i, 1);
                break;
            }
        }
        updateQueue();
    });
    socket.on("vote king", function(){
        if(gamegoing) {
            if (waitedTime(socket.id)){
                users[socket.id]["lastvotetime"] = Date.now();
                kingvotes++;
                updateUI();
            }else{
                socket.emit("need wait", Date.now()-users[socket.id]["lastvotetime"]);
            }
            updateTimer();
        }
    });
    socket.on("vote peas", function(){
        if(gamegoing) {
            if (waitedTime(socket.id)){
                users[socket.id]["lastvotetime"] = Date.now();
                peasvotes++;
                updateUI();
            }else{
                socket.emit("need wait", Date.now()-users[socket.id]["lastvotetime"]);
            }
            updateTimer();
        }
    });
    socket.on("start game", function () {
        if(!gamegoing){
            gamegoing=true;
            starttime=Date.now();
            kingvotes=0;
            peasvotes=0;
            kingink=0;
            peasink=0;
            io.emit("disable all");
            io.sockets.connected[queuedusers[0]].emit("enable king");
            io.sockets.connected[queuedusers[1]].emit("enable peas");
            io.emit("game start");
            updateTimer();
            updateUI();
        }
    });
    socket.on("end game", function(){
        if(gamegoing){
            gamegoing=false;
            if(peasvotes>kingvotes){

            }else if(kingvotes>peasvotes){

            }else if(peasink<kingink){

            }
            io.emit("end game", kingvotes);
        }
    });

    socket.on("king draw", function(pic){
        kingpic = pic;
        kingink+=1;
        //socket.to('others').emit("king update", kingpic);
        io.emit("king update", kingpic);
        io.emit("king ink", kingink);
        //console.log(kingink);
    });
    socket.on("peas draw", function(pic){
        peaspic = pic;
        peasink+=1;
        //console.log(peasink);
        //socket.to('others').emit("peas update", peaspic);
        io.emit("peas update", peaspic);
        io.emit("peas ink", peasink);

    });

});

function waitedTime(sid){
    var lastvotetime = users[sid]["lastvotetime"];
    var curtime = Date.now();
    if(lastvotetime==null){
        return true;
    }
    if((curtime-lastvotetime)/1000<=seconds_to_wait){
        return false;
    }

    return true;
}

function updateTimer(){
    io.emit("update timer", {
        "start": starttime==null ? Date.now() : starttime,
        "current": Date.now(),
        "duration": seconds_duration
    });
}

function updateUI(){
    io.emit("update ui", getGameState());
}

function getGameState(){
    return {
        "peasvotes": peasvotes,
        "kingvotes": kingvotes,
        "time": starttime,
    };
}

function updateQueue(){
    var queue = [];
    for(var i = 0; i<queuedusers.length; i++){
        queue.push(users[queuedusers[i]]);
    }
    io.emit("update queue", queue);
}