var io = require('socket.io')(5000);
var fs = require('fs');
// id -> json

var topicarray = fs.readFileSync(__dirname+"/todraw.txt").toString().split('\n');
var leaderjson = JSON.parse(fs.readFileSync(__dirname+"/../frontend/leaderboard.json").toString());
//console.log(topicarray);
var seconds_to_wait = 5;
var seconds_duration = 20;

var users = {};


var kingvotes= 0, peasvotes= 0;
var kingid, peasid;
var kingink= 0, peasink=0;

var kingpic = [];
var peaspic = [];
var curtopic = "topic";

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
            if(gamegoing){
                socket.emit("game start", curtopic);
                socket.emit("king update", kingpic);
                socket.emit("peas update", peaspic);
                io.emit("king ink", kingink);
                io.emit("peas ink", peasink);
                socket.emit("update ui", getGameState());
                updateTimer();
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
            curtopic = topicarray[Math.floor(Math.random() * topicarray.length)];
            starttime=Date.now();
            kingvotes=0;
            peasvotes=0;
            kingink=0;
            peasink=0;
            io.emit("disable all");
            io.sockets.connected[queuedusers[0]].emit("enable king");
            io.sockets.connected[queuedusers[1]].emit("enable peas");
            io.emit("game start", curtopic);
            updateTimer();
            updateUI();
            setTimeout(endgame,seconds_duration*1000);
        }
    });
    function endgame(){
        if(gamegoing){
            gamegoing=false;
            if(peasvotes>kingvotes){//peaswins
                var tuser = queuedusers.shift();
                queuedusers.push(tuser);
            }else if(kingvotes>peasvotes){//king
                var tuser = queuedusers[1];
                queuedusers.splice(1,1);
                queuedusers.push(tuser);
            }else if(peasink<kingink){//peas
                var tuser = queuedusers.shift();
                queuedusers.push(tuser);

            }else{//king
                var tuser = queuedusers[1];
                queuedusers.splice(1,1);
                queuedusers.push(tuser);
            }
            var winname = users[queuedusers[0]].name;
            var madechange=false;
            for(var i=0; i<leaderjson.length; i++){
                var c = leaderjson[i];
                if(c.name==winname){
                    c["wins"]++;
                    madechange=true;
                    break;
                }
            }
            if(!madechange){
                leaderjson.push({"name": winname, "wins": 1});
            }
            leaderjson.sort(function(a, b){
                if(a.wins> b.wins){
                    return 1;
                }if(a.wins < b.wins){
                    return -1;
                }
                return 0;
            });
            fs.writeFile(__dirname+"/../frontend/leaderboard.json", JSON.stringify(leaderjson), function(err){
                console.log(err);
            });
            updateQueue();
            io.emit("game end");
        }
    }

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
        "time": starttime
    };
}

function updateQueue(){
    var queue = [];
    for(var i = 0; i<queuedusers.length; i++){
        queue.push(users[queuedusers[i]]);
    }
    io.emit("update queue", queue);
}