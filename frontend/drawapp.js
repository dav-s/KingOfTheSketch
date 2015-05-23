$(document).ready(function() {
    var p1 = new DrawingBoard.Board('p1',{
		controls: [
		'Size',
		'Color'
		
	],
	controlsPosition: 'top right'
    });

    var p2 = new DrawingBoard.Board('p2',{
		controls: [
		'Color',
		'Size'
	],
    });
});


