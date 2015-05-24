/**
 * Created by davis on 5/23/15.
 */
$(document).ready(function(){
    makePainty("kingcanv");
    makePainty("peascanv");
});

function line(){
    this.xpoints = [];
    this.ypoints = [];
}

function addpoint(line, xval, yval){
    line.xpoints.push(xval);
    line.ypoints.push(yval);
}

function makePainty(id){
    var linenum = 0;
    var paint = false;
    var canv = document.getElementById(id);

    var context = canv.getContext("2d");
    var lines = [new line()];
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
        lines.push(new line());
        linenum++;
    });
    $canv.mouseleave(function(e){
        paint = false;
        lines.push(new line());
        linenum++;
    });
    function addClick(x, y)
    {
        addpoint(lines[linenum], x, y);
    }
    function redraw(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

        //context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 5;

        for(var i=0; i < lines.length; i++) {
            var line = lines[i];
            for(var j=1; j<line.xpoints.length; j++){
                context.beginPath();
                context.moveTo(line.xpoints[j-1], line.ypoints[j-1]);
                context.lineTo(line.xpoints[j], line.ypoints[j]);
                context.closePath();
                context.stroke();
            }
        }
    }
}