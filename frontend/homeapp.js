$(document).ready(function() {
    hideTabs();
    $("#b1").click(function(){
    	hideTabs();
    	$("#play-now").show();
    });
    $("#b2").click(function(){
    	hideTabs();
    	$("#how-to-play").show();
    });
    $("#b3").click(function(){
    	hideTabs();
    	$("#leaderboards").show();
    });
});


function hideTabs(){
	$("#play-now").hide();
	$("#how-to-play").hide();
	$("#leaderboards").hide();
}


