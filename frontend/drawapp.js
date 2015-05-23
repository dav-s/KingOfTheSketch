$(document).ready(function() {
    var p1 = new DrawingBoard.Board('player1',{
		controls: [
		'Size',
		'Color'
		
	],
	controlsPosition: 'top right'
    });

    var p2 = new DrawingBoard.Board('player2',{
		controls: [
		'Color',
		'Size'
	],
    });
});


