/**
 * Created by davis on 5/23/15.
 */
var selcol = "black", selradius = 5;
$(document).ready(function(){
    //var kingcanv = new UneditableCanvas("kingcanv");
    createCanvas("p1", "kingcanv");
    createCanvas("p2", "peascanv");
    kingcanv = new UneditableCanvas("kingcanv");
    peascanv = new UneditableCanvas("peascanv");
    //EditableCanvas("kingcanv", "king");
    //EditableCanvas("peascanv", "peas");
    socket.on("king update", function(lines){
        //console.log("whatt");
        if(kingcanv instanceof UneditableCanvas) {
            kingcanv.update(lines);
        }
    });socket.on("peas update", function(lines){
        //console.log("whatt");
        if(peascanv instanceof UneditableCanvas) {
            peascanv.update(lines);
        }
    });
});

function createCanvas(locationid, id){
    $("#"+locationid).html("<canvas id='"+id+"' width='400px' height='400px' style='border: 2px solid black'></canvas>");
}

function Line(){
    this.xpoints = [];
    this.ypoints = [];
    this.radius=selradius;
    this.color=selcol;
}


function addpoint(line, xval, yval){
    line.xpoints.push(xval);
    line.ypoints.push(yval);
}

function linesRedraw(context, lines){
    context.lineJoin = "round";
    for(var i=0; i < lines.length; i++) {
        var line = lines[i];
        context.lineWidth=line.radius;
        context.strokeStyle = line.color;
        for(var j=1; j<line.xpoints.length; j++){
            context.beginPath();
            context.moveTo(line.xpoints[j-1], line.ypoints[j-1]);
            context.lineTo(line.xpoints[j], line.ypoints[j]);
            context.closePath();
            context.stroke();
        }
    }
}

function UneditableCanvas(id){
    this.canv = document.getElementById(id);

    this.context = this.canv.getContext("2d");
    this.lines = [];
    this.update = function(newlines){
        //console.log("dink");
        this.lines = newlines;
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height); // Clears the canvas
        linesRedraw(this.context, this.lines);
    }
}

function EditableCanvas(id, type){
    var useable = type=='king' || type=='peas';
    //console.log(useable);
    var linenum = 0;
    var paint = false;
    var canv = document.getElementById(id);

    var context = canv.getContext("2d");
    var lines = [new Line()];
    $canv = $("#"+id);
    $canv.mousedown(function(e){
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        paint = true;
        addClick(mouseX, mouseY);
        redraw();
    });
    $canv.mousemove(function(e){
        if(paint){
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            addClick(mouseX, mouseY);
            redraw();
        }
    });
    $canv.mouseup(function(e){
        paint = false;
        lines.push(new Line());
        linenum++;
    });
    $canv.mouseleave(function(e){
        paint = false;
        lines.push(new Line());
        linenum++;
    });
    function addClick(x, y)
    {
        if(getRemainingInk(type)>0) {
            addpoint(lines[linenum], x, y);
        }
    }
    function redraw(){
        //console.log("beer");
        if(useable){
            //console.log("here");
            if(getRemainingInk(type)>0) {
                socket.emit(type + " draw", lines);
            }
        }
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        linesRedraw(context, lines);

        //context.strokeStyle = "#df4b26";

    }
}
