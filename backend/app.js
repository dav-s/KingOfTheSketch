var io = require('socket.io')(5000);
// id -> json
var users = {};

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
        }else{
            socket.emit("name taken");
        }
    });
    socket.on("disconnect", function(){
        console.log("dis "+socket.id);
        if(users[socket.id]!=null){
            delete users[socket.id];
        }
    });
});

