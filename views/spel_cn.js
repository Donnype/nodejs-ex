var url_string = window.location.href;
var url = new URL(url_string);
var urlroom = url.searchParams.get("room");

if (urlroom != null){
	enter_room(urlroom);
};

yalla = function(){

	var roomname = document.getElementById("room").value;
	
	if(roomname == ''){
		window.alert("Vul een lobbynaam in!");
        return;
	}
	
	enter_room(roomname);
	 	
	var url = "/?room=" + roomname;
	history.replaceState( {} , roomname, url );
	
};

function enter_room(roomname){
	$(function(){
    	$("#includedContent").load("board.html");	
	})
	
	var checkExist = setInterval(function() {
   		if ($('#11').length) {
      		Client.joinroom(roomname);
      		clearInterval(checkExist);
   		}
	}, 100);
	
	document.getElementById("lobby-container").innerHTML = "";
};

makeboard = function(room){
	for (i = 0; i < 25; i++) { 
		var idstring = locaties[i];
		document.getElementById(idstring).innerHTML = room.woorden[i];
		if(room.gedrukt.indexOf(idstring) >= 0) {
			document.getElementById(idstring).style.background = room.kleuren[i];
			document.getElementById(idstring).style.color = "white";
   		}
   		else {
		document.getElementById(idstring).style.background = "lightgrey";
			document.getElementById(idstring).style.color = "black";
		}
	}
};

var locaties = ["11","12","13","14","15","21","22","23","24","25","31","32",
"33","34","35","41","42","43","44","45","51","52","53","54","55"];

var t = 0;

function kleurenset(room) {
	kleuren_random = room.kleuren;	
}

function spymaster(){
	for (i = 0; i < 25; i++) 
		{ 
			var idstring = locaties[i];
			if (t == 0 && document.getElementById(idstring).style.background == "lightgrey")
    			{
    			document.getElementById(idstring).style.color = kleuren_random[i];
    			}
    		if (t == 1 && document.getElementById(idstring).style.background == "lightgrey")
    			{
    			document.getElementById(idstring).style.color = "black";
    			}
		}
	if (t == 0)
    	{t = 1;}
    else
    	{t = 0;}
}

function myFunction(element) {
	if (t == 0){
		id = element.id;
    	element.style.background = kleuren_random[locaties.indexOf(id)];
    	element.style.color = "white";
    	Client.klik(id);
    }
}

function myServerFunction(id) {
    document.getElementById(id).style.background = kleuren_random[locaties.indexOf(id)];
    document.getElementById(id).style.color = "white";
}


