$(document).ready(function() {
    hideTabs();
    $("#play-now").show();
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
		$.get("leaderboard.json", function(data){
			var html = "<tr><th>Position</th><th>Name</th><th>Wins</th></tr>";
			$.each(data, function(index, val){
				html+="<tr><td>"+(index+1)+"</td><td>"+val.name+"</td><td>"+val.wins+"</td></tr>";
			});
			$("#leader-table").html(html);
		});

    });
});


function hideTabs(){
	$("#play-now").hide();
	$("#how-to-play").hide();
	$("#leaderboards").hide();
}


